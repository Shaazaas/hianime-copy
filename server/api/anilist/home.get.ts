import { anilistRequest, listMediaFragment, normalizeMediaPage } from '../../utils/anilist'
import type { HomeCatalog } from '../../../app/types/anime'

export default defineEventHandler(async (event): Promise<HomeCatalog> => {
  setHeader(event, 'Cache-Control', 'public, max-age=600, stale-while-revalidate=1800')

  const query = `
    query HomeCatalog {
      spotlight: Page(page: 1, perPage: 8) {
        media(type: ANIME, sort: [TRENDING_DESC], isAdult: false) { ${listMediaFragment} }
      }
      trending: Page(page: 1, perPage: 10) {
        media(type: ANIME, sort: [TRENDING_DESC], isAdult: false) { ${listMediaFragment} }
      }
      topAiring: Page(page: 1, perPage: 5) {
        media(type: ANIME, sort: [POPULARITY_DESC], status: RELEASING, isAdult: false) { ${listMediaFragment} }
      }
      popular: Page(page: 1, perPage: 5) {
        media(type: ANIME, sort: [POPULARITY_DESC], isAdult: false) { ${listMediaFragment} }
      }
      favourites: Page(page: 1, perPage: 5) {
        media(type: ANIME, sort: [FAVOURITES_DESC], isAdult: false) { ${listMediaFragment} }
      }
      completed: Page(page: 1, perPage: 5) {
        media(type: ANIME, sort: [END_DATE_DESC], status: FINISHED, isAdult: false) { ${listMediaFragment} }
      }
      recommended: Page(page: 1, perPage: 12) {
        media(type: ANIME, sort: [TRENDING_DESC], isAdult: false) { ${listMediaFragment} }
      }
      top: Page(page: 1, perPage: 10) {
        media(type: ANIME, sort: [SCORE_DESC], isAdult: false) { ${listMediaFragment} }
      }
      schedule: Page(page: 1, perPage: 8) {
        media(type: ANIME, sort: [START_DATE_DESC], status: RELEASING, isAdult: false) { ${listMediaFragment} }
      }
    }
  `

  const data = await anilistRequest<Record<keyof HomeCatalog, { media: Parameters<typeof normalizeMediaPage>[0]['media'] }>>(query)

  return {
    spotlight: normalizeMediaPage(data.spotlight),
    trending: normalizeMediaPage(data.trending),
    topAiring: normalizeMediaPage(data.topAiring),
    popular: normalizeMediaPage(data.popular),
    favourites: normalizeMediaPage(data.favourites),
    completed: normalizeMediaPage(data.completed),
    recommended: normalizeMediaPage(data.recommended),
    top: normalizeMediaPage(data.top),
    schedule: normalizeMediaPage(data.schedule)
  }
})
