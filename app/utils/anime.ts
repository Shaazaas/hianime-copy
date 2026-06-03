import type { AnimeListItem } from '@/types/anime'

export function animeTitle(media?: Pick<AnimeListItem, 'displayTitle'> | null) {
  return media?.displayTitle || 'Unknown title'
}

export function animeSlug(id: number, title: string) {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return `${id}-${slug || 'anime'}`
}

export function idFromSlug(slug: string | string[] | undefined) {
  const value = Array.isArray(slug) ? slug[0] : slug
  const id = Number.parseInt(value?.split('-')[0] || '', 10)

  return Number.isFinite(id) ? id : null
}

export function detailPath(media: AnimeListItem) {
  return `/anime/${media.slug}`
}

export function watchPath(media: AnimeListItem, episode = 1) {
  return media.badges.episodes ? `/watch/${media.slug}?ep=${episode}` : detailPath(media)
}

export function formatKind(value: string | null) {
  if (!value) return 'Unknown'
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}

export function formatDuration(minutes: number | null) {
  return minutes ? `${minutes} min` : 'Unknown'
}

export function formatDateLabel(value: string | null) {
  if (!value) return 'Unknown'
  return value
}

export function normalizeVisibleText(value: string) {
  return value.replace(/[—–]/g, '-')
}

export function stripHtml(value: string | null | undefined) {
  return (value || 'No description is available from AniList yet.')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}
