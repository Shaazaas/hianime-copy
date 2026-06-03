import { animeSlug, normalizeVisibleText, stripHtml } from '../../app/utils/anime'
import type { AnimeCharacter, AnimeDetail, AnimeListItem } from '../../app/types/anime'

const ANILIST_URL = 'https://graphql.anilist.co'
const requestCache = new Map<string, { expiresAt: number; data: unknown }>()

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface GraphDate {
  year: number | null
  month: number | null
  day: number | null
}

interface GraphMedia {
  id: number
  title: {
    romaji: string
    english: string | null
    native: string | null
  }
  description: string | null
  coverImage: {
    extraLarge: string
    large: string
  }
  bannerImage: string | null
  seasonYear: number | null
  genres: string[] | null
  episodes: number | null
  duration: number | null
  format: string | null
  status: string | null
  averageScore: number | null
  synonyms?: string[]
  startDate?: GraphDate
  endDate?: GraphDate
  studios?: {
    nodes: Array<{ name: string; isAnimationStudio: boolean }>
  }
  staff?: {
    nodes: Array<{ name: { full: string } }>
  }
  characters?: {
    edges: Array<{
      role: string | null
      node: {
        id: number
        name: { full: string }
        image: { medium: string | null }
      }
      voiceActors: Array<{
        name: { full: string }
        image: { medium: string | null }
        languageV2: string | null
      }>
    }>
  }
  recommendations?: {
    nodes: Array<{
      mediaRecommendation: GraphMedia | null
    }>
  }
}

interface PageInfo {
  total: number
  currentPage: number
  hasNextPage: boolean
}

interface PageResponse {
  Page: {
    pageInfo: PageInfo
    media: GraphMedia[]
  }
}

export async function anilistRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  const cacheKey = JSON.stringify({ query, variables })
  const cached = requestCache.get(cacheKey)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data as T
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await $fetch<{ data: T }>(ANILIST_URL, {
        method: 'POST',
        body: { query, variables },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      requestCache.set(cacheKey, {
        data: response.data,
        expiresAt: Date.now() + 10 * 60 * 1000
      })

      return response.data
    } catch (error) {
      if (cached) {
        return cached.data as T
      }

      const status = typeof error === 'object' && error && 'statusCode' in error ? Number(error.statusCode) : null
      if (status === 429 && attempt === 0) {
        await wait(1800)
        continue
      }

      throw error
    }
  }

  throw new Error('AniList request failed')
}

export const listMediaFragment = `
  id
  title { romaji english native }
  description(asHtml: false)
  coverImage { extraLarge large }
  bannerImage
  seasonYear
  genres
  episodes
  duration
  format
  status
  averageScore
`

export function normalizeMedia(media: GraphMedia): AnimeListItem {
  const displayTitle = normalizeVisibleText(media.title.english || media.title.romaji || media.title.native || 'Unknown title')

  return {
    id: media.id,
    slug: animeSlug(media.id, displayTitle),
    title: media.title,
    displayTitle,
    description: stripHtml(media.description),
    coverImage: media.coverImage.extraLarge || media.coverImage.large,
    bannerImage: media.bannerImage,
    seasonYear: media.seasonYear,
    genres: media.genres || [],
    badges: {
      episodes: media.episodes,
      duration: media.duration,
      format: media.format,
      status: media.status,
      averageScore: media.averageScore
    }
  }
}

export function normalizePage(data: PageResponse) {
  return {
    items: data.Page.media.map(normalizeMedia),
    page: data.Page.pageInfo.currentPage,
    total: data.Page.pageInfo.total,
    hasNextPage: data.Page.pageInfo.hasNextPage
  }
}

export function normalizeDate(date?: GraphDate) {
  if (!date?.year) return null
  const month = date.month ? String(date.month).padStart(2, '0') : '??'
  const day = date.day ? String(date.day).padStart(2, '0') : '??'

  return `${date.year}-${month}-${day}`
}

export function normalizeDetail(media: GraphMedia): AnimeDetail {
  const base = normalizeMedia(media)
  const characters: AnimeCharacter[] = (media.characters?.edges || []).map(edge => ({
    id: edge.node.id,
    name: edge.node.name.full,
    image: edge.node.image.medium,
    role: edge.role,
    voiceActor: edge.voiceActors[0]
      ? {
          name: edge.voiceActors[0].name.full,
          image: edge.voiceActors[0].image.medium,
          language: edge.voiceActors[0].languageV2
        }
      : null
  }))

  return {
    ...base,
    nativeTitle: media.title.native,
    synonyms: media.synonyms || [],
    startDate: normalizeDate(media.startDate),
    endDate: normalizeDate(media.endDate),
    studios: (media.studios?.nodes || []).filter(studio => studio.isAnimationStudio).map(studio => studio.name),
    producers: (media.staff?.nodes || []).slice(0, 6).map(staff => staff.name.full),
    characters,
    recommendations: (media.recommendations?.nodes || [])
      .map(node => node.mediaRecommendation)
      .filter((item): item is GraphMedia => Boolean(item))
      .map(normalizeMedia)
  }
}

export async function fetchMediaList(variables: Record<string, unknown>) {
  const query = `
    query CatalogList($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $format: MediaFormat, $search: String, $genre: String, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage hasNextPage }
        media(type: ANIME, sort: $sort, status: $status, format: $format, search: $search, genre: $genre, seasonYear: $seasonYear, isAdult: false) {
          ${listMediaFragment}
        }
      }
    }
  `

  return normalizePage(await anilistRequest<PageResponse>(query, variables))
}

export function normalizeMediaPage(page: Pick<PageResponse['Page'], 'media'>) {
  return page.media.map(normalizeMedia)
}
