import { anilistRequest, listMediaFragment, normalizeDetail, fetchMediaList } from '../../../utils/anilist'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=900, stale-while-revalidate=1800')

  const id = Number.parseInt(getRouterParam(event, 'id') || '', 10)

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid AniList media ID' })
  }

  const query = `
    query MediaDetail($id: Int) {
      Media(id: $id, type: ANIME) {
        ${listMediaFragment}
        synonyms
        startDate { year month day }
        endDate { year month day }
        studios { nodes { name isAnimationStudio } }
        staff(perPage: 8) { nodes { name { full } } }
        characters(perPage: 10, sort: [ROLE, RELEVANCE]) {
          edges {
            role
            node { id name { full } image { medium } }
            voiceActors(language: JAPANESE, sort: [RELEVANCE]) {
              name { full }
              image { medium }
              languageV2
            }
          }
        }
        recommendations(perPage: 12, sort: RATING_DESC) {
          nodes {
            mediaRecommendation {
              ${listMediaFragment}
            }
          }
        }
      }
    }
  `

  let data: { Media: Parameters<typeof normalizeDetail>[0] | null }

  try {
    data = await anilistRequest<{ Media: Parameters<typeof normalizeDetail>[0] | null }>(query, { id })
  } catch (error) {
    const status = typeof error === 'object' && error && 'statusCode' in error ? Number(error.statusCode) : null
    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
    }

    throw error
  }

  if (!data.Media) {
    throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
  }

  const detail = normalizeDetail(data.Media)

  if (!detail.recommendations.length) {
    const fallback = await fetchMediaList({ page: 1, perPage: 12, sort: ['TRENDING_DESC'] })
    detail.recommendations = fallback.items.filter(item => item.id !== id)
  }

  return detail
})
