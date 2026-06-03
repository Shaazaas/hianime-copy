<script setup lang="ts">
import type { FilterCatalog } from '@/types/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import {
  catalogFormatOptions,
  catalogGenres,
  catalogSortOptions,
  catalogStatusOptions,
  normalizeCatalogFormat,
  normalizeCatalogPage,
  normalizeCatalogSort,
  normalizeCatalogStatus
} from '@/utils/catalogFilters'

const route = useRoute()
const router = useRouter()

const page = computed(() => normalizeCatalogPage(route.query.page))
const status = computed(() => normalizeCatalogStatus(route.query.status))
const format = computed(() => normalizeCatalogFormat(route.query.format))
const genre = computed(() => String(route.query.genre || 'all'))
const sort = computed(() => normalizeCatalogSort(route.query.sort))
const search = computed(() => String(route.query.search || ''))

const { data } = await useFetch<FilterCatalog>('/api/anilist/filter', {
  query: { page, status, format, genre, sort, search },
  default: () => ({ items: [], page: 1, total: 0, hasNextPage: false }),
  watch: [page, status, format, genre, sort, search]
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

const statusModel = computed({
  get: () => status.value,
  set: value => updateQuery({ status: value })
})
const formatModel = computed({
  get: () => format.value,
  set: value => updateQuery({ format: value })
})
const sortModel = computed({
  get: () => sort.value,
  set: value => updateQuery({ sort: value })
})
const paginationPage = computed({
  get: () => page.value,
  set: value => updateQuery({ page: value })
})

useSeoMeta({
  title: 'Filter'
})
</script>

<template>
  <div class="min-h-screen bg-[var(--catalog-bg)]">
    <AppHeader />
    <UContainer as="main" class="mt-10 max-w-[1260px]">
      <p class="mb-8 font-bold text-default">Home • Filter</p>
      <UCard title="Filter" variant="subtle" class="catalog-surface" :ui="{ title: 'text-base font-extrabold text-highlighted' }">
        <div class="mt-1 flex flex-wrap gap-4">
          <UFormField label="Status">
            <USelect v-model="statusModel" :items="catalogStatusOptions" class="w-48" />
          </UFormField>
          <UFormField label="Format">
            <USelect v-model="formatModel" :items="catalogFormatOptions" class="w-48" />
          </UFormField>
          <UFormField label="Sort">
            <USelect v-model="sortModel" :items="catalogSortOptions" class="w-48" />
          </UFormField>
        </div>
        <h2 class="mt-7 text-base font-extrabold text-highlighted">Genres</h2>
        <div class="mt-3.5 flex flex-wrap gap-2">
          <UButton
            v-for="item in catalogGenres"
            :key="item"
            size="sm"
            :variant="genre.toLowerCase() === item.toLowerCase() ? 'solid' : 'outline'"
            @click="updateQuery({ genre: item.toLowerCase() === 'all' ? 'all' : item })"
          >
            {{ item }}
          </UButton>
        </div>
      </UCard>

      <section class="mt-10 grid grid-cols-4 gap-6 max-[840px]:grid-cols-2">
        <AnimeCard v-for="item in data.items" :key="item.id" :media="item" />
      </section>

      <UPagination
        v-model:page="paginationPage"
        :items-per-page="24"
        :total="Math.min(data.total, 240)"
        show-edges
        class="mx-auto mt-12 justify-center"
      />
    </UContainer>
    <AppFooter />
  </div>
</template>
