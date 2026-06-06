export const catalogGenres = ['All', 'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 'Ecchi', 'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 'Kids', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 'Parody', 'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi', 'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 'Space', 'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'] as const

export const catalogStatusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Airing', value: 'airing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Upcoming', value: 'upcoming' }
] as const

export const catalogFormatOptions = [
  { label: 'All', value: 'all' },
  { label: 'TV', value: 'TV' },
  { label: 'Movies', value: 'MOVIE' },
  { label: 'OVA', value: 'OVA' },
  { label: 'ONA', value: 'ONA' },
  { label: 'Specials', value: 'SPECIAL' }
] as const

export const catalogSortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
  { label: 'Score', value: 'score' },
  { label: 'Favourites', value: 'favourites' },
  { label: 'Latest', value: 'latest' }
] as const

export type CatalogStatus = typeof catalogStatusOptions[number]['value']
export type CatalogFormat = typeof catalogFormatOptions[number]['value']
export type CatalogSort = typeof catalogSortOptions[number]['value']

const validStatuses = new Set<string>(catalogStatusOptions.map(option => option.value))
const validFormats = new Set<string>(catalogFormatOptions.map(option => option.value))
const validSorts = new Set<string>(catalogSortOptions.map(option => option.value))

export function normalizeCatalogPage(value: unknown) {
  const page = Number.parseInt(String(value || '1'), 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

export function normalizeCatalogStatus(value: unknown): CatalogStatus {
  const status = String(value || 'all')

  return validStatuses.has(status) ? status as CatalogStatus : 'all'
}

export function normalizeCatalogFormat(value: unknown): CatalogFormat {
  const format = String(value || 'all')

  return validFormats.has(format) ? format as CatalogFormat : 'all'
}

export function normalizeCatalogSort(value: unknown): CatalogSort {
  const sort = String(value || 'default')

  return validSorts.has(sort) ? sort as CatalogSort : 'default'
}
