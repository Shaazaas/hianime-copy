import { fetchMediaList } from '../../utils/anilist'
import type { FilterCatalog } from '../../../app/types/anime'
import {
  normalizeCatalogFormat,
  normalizeCatalogPage,
  normalizeCatalogSort,
  normalizeCatalogStatus
} from '../../../app/utils/catalogFilters'

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

const formatMap: Record<string, string | undefined> = {
  all: undefined,
  TV: 'TV',
  MOVIE: 'MOVIE',
  OVA: 'OVA',
  ONA: 'ONA',
  SPECIAL: 'SPECIAL'
}

export default defineEventHandler(async (event): Promise<FilterCatalog> => {
  setHeader(event, 'Cache-Control', 'public, max-age=600, stale-while-revalidate=1800')

  const query = getQuery(event)
  const page = normalizeCatalogPage(query.page)
  const genre = String(query.genre || 'all')
  const status = normalizeCatalogStatus(query.status)
  const format = normalizeCatalogFormat(query.format)
  const sort = normalizeCatalogSort(query.sort)
  const search = String(query.search || '').trim()

  return fetchMediaList({
    page,
    perPage: 24,
    genre: genre === 'all' ? undefined : genre,
    status: statusMap[status],
    format: formatMap[format],
    search: search || undefined,
    sort: sortMap[sort] || sortMap.default
  })
})
