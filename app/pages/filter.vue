<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import type { FilterCatalog } from '@/types/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'

const route = useRoute()
const router = useRouter()

const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Isekai', 'Mecha', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller']
const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Airing', value: 'airing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Upcoming', value: 'upcoming' }
]
const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Trending', value: 'trending' },
  { label: 'Score', value: 'score' },
  { label: 'Favourites', value: 'favourites' },
  { label: 'Latest', value: 'latest' }
]

const page = computed(() => Number.parseInt(String(route.query.page || '1'), 10) || 1)
const status = computed(() => String(route.query.status || 'all'))
const genre = computed(() => String(route.query.genre || 'all'))
const sort = computed(() => String(route.query.sort || 'default'))
const search = computed(() => String(route.query.search || ''))

const { data } = await useFetch<FilterCatalog>('/api/anilist/filter', {
  query: { page, status, genre, sort, search },
  default: () => ({ items: [], page: 1, total: 0, hasNextPage: false }),
  watch: [page, status, genre, sort, search]
})

function updateQuery(next: Record<string, string | number>) {
  router.push({
    path: '/filter',
    query: {
      ...route.query,
      ...next,
      page: next.page || 1
    }
  })
}

useSeoMeta({
  title: 'Filter'
})
</script>

<template>
  <div>
    <AppHeader />
    <main class="filter-page">
      <p class="filter-page__crumb">Home • Filter</p>
      <section class="filter-panel">
        <h1>Filter</h1>
        <div class="filter-panel__row">
          <label>
            Status
            <select :value="status" @change="updateQuery({ status: ($event.target as HTMLSelectElement).value })">
              <option v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </label>
          <label>
            Sort
            <select :value="sort" @change="updateQuery({ sort: ($event.target as HTMLSelectElement).value })">
              <option v-for="item in sortOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </label>
        </div>
        <h2>Genres</h2>
        <div class="filter-panel__genres">
          <Button
            v-for="item in genres"
            :key="item"
            size="sm"
            :variant="genre.toLowerCase() === item.toLowerCase() ? 'default' : 'outline'"
            @click="updateQuery({ genre: item.toLowerCase() === 'all' ? 'all' : item })"
          >
            {{ item }}
          </Button>
        </div>
      </section>

      <section class="filter-page__grid">
        <AnimeCard v-for="item in data.items" :key="item.id" :media="item" />
      </section>

      <Pagination v-slot="{ page: currentPage }" :items-per-page="24" :total="Math.min(data.total, 240)" :default-page="page" class="filter-page__pagination">
        <PaginationContent>
          <PaginationPrevious @click="updateQuery({ page: Math.max(1, page - 1) })" />
          <PaginationItem :value="1" :is-active="currentPage === 1" @click="updateQuery({ page: 1 })">1</PaginationItem>
          <PaginationItem :value="2" :is-active="currentPage === 2" @click="updateQuery({ page: 2 })">2</PaginationItem>
          <PaginationEllipsis />
          <PaginationItem :value="10" @click="updateQuery({ page: 10 })">10</PaginationItem>
          <PaginationNext @click="updateQuery({ page: page + 1 })" />
        </PaginationContent>
      </Pagination>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.filter-page {
  width: min(1260px, calc(100% - 48px));
  margin: 42px auto 0;
}

.filter-page__crumb {
  margin-bottom: 34px;
  color: hsl(var(--foreground));
  font-weight: 700;
}

.filter-panel {
  padding: 30px;
  border-radius: 10px;
  background: hsl(var(--card));
}

.filter-panel h1,
.filter-panel h2 {
  color: hsl(var(--foreground));
  font-size: 1rem;
  font-weight: 800;
}

.filter-panel h2 {
  margin-top: 28px;
}

.filter-panel__row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 18px;
}

.filter-panel label {
  display: grid;
  gap: 8px;
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
  font-weight: 700;
}

.filter-panel select {
  width: 180px;
  height: 38px;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  background: hsl(var(--background));
  padding: 0 12px;
  color: hsl(var(--foreground));
}

.filter-panel__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.filter-page__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-top: 42px;
}

.filter-page__pagination {
  margin: 50px auto 0;
  justify-content: center;
}

@media (max-width: 840px) {
  .filter-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
