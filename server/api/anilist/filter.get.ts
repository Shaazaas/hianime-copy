import { fetchMediaList } from '../../utils/anilist'
import type { FilterCatalog } from '../../../app/types/anime'

const sortMap: Record<string, string[]> = {
  default: ['POPULARITY_DESC'],
  trending: ['TRENDING_DESC'],
  score: ['SCORE_DESC'],
  favourites: ['FAVOURITES_DESC'],
  latest: ['START_DATE_DESC']
}

const statusMap: Record<string, string | undefined> = {
  all: undefined,
  airing: 'RELEASING',
  completed: 'FINISHED',
  upcoming: 'NOT_YET_RELEASED'
}

export default defineEventHandler(async (event): Promise<FilterCatalog> => {
  setHeader(event, 'Cache-Control', 'public, max-age=600, stale-while-revalidate=1800')

  const query = getQuery(event)
  const page = Number.parseInt(String(query.page || '1'), 10)
  const genre = String(query.genre || 'all')
  const status = String(query.status || 'all')
  const sort = String(query.sort || 'default')
  const search = String(query.search || '').trim()

  return fetchMediaList({
    page: Number.isFinite(page) ? page : 1,
    perPage: 24,
    genre: genre === 'all' ? undefined : genre,
    status: statusMap[status],
    search: search || undefined,
    sort: sortMap[sort] || sortMap.default
  })
})
