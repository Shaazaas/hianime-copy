import { fetchMediaList } from '../../utils/anilist'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=900')

  const query = getQuery(event)
  const search = String(query.q || '').trim()

  if (search.length < 1) {
    return []
  }

  const page = await fetchMediaList({
    page: 1,
    perPage: 8,
    search,
    sort: ['POPULARITY_DESC']
  })

  return page.items
})
