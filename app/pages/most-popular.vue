<script setup lang="ts">
import type { FilterCatalog, HomeCatalog, AnimeListItem } from '@/types/anime'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import MetaBadges from '@/components/catalog/MetaBadges.vue'
import { detailPath, formatDuration, formatKind } from '@/utils/anime'

definePageMeta({
  viewTransition: {
    enabled: true,
    toTypes: (_to, from) => from.path.startsWith('/anime/') ? ['catalog-return'] : [],
    fromTypes: to => to.path.startsWith('/anime/') ? ['catalog-drill'] : []
  }
})

const route = useRoute()
const router = useRouter()
const page = computed(() => {
  const value = Number.parseInt(String(route.query.page || '1'), 10)

  return Number.isFinite(value) && value > 0 ? value : 1
})

const { data } = await useFetch<FilterCatalog>('/api/anilist/filter', {
  query: { page, sort: 'popular' },
  default: () => ({ items: [], page: 1, total: 0, hasNextPage: false }),
  watch: [page]
})

const { data: homeData } = await useFetch<HomeCatalog>('/api/anilist/home', {
  default: () => ({
    spotlight: [],
    trending: [],
    topAiring: [],
    popular: [],
    favourites: [],
    completed: [],
    recommended: [],
    top: [],
    schedule: []
  })
})

const topItems = computed(() => {
  const seen = new Set<number>()
  const items: AnimeListItem[] = []

  for (const item of [
    ...homeData.value.popular,
    ...homeData.value.trending,
    ...homeData.value.top,
    ...data.value.items
  ]) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    items.push(item)
  }

  return items.slice(0, 10)
})

const pageItems = computed(() => {
  const pages = [1]
  if (page.value > 2) pages.push(page.value - 1)
  if (!pages.includes(page.value)) pages.push(page.value)
  if (data.value.hasNextPage && !pages.includes(page.value + 1)) pages.push(page.value + 1)

  return pages.slice(0, 4)
})

function pagePath(targetPage: number) {
  return targetPage === 1 ? '/most-popular' : `/most-popular?page=${targetPage}`
}

function goToPage(targetPage: number) {
  if (targetPage < 1) return
  router.push(pagePath(targetPage))
}

useHianimeSeo({
  ...hianimeMostPopularSeo
})
</script>

<template>
  <div class="min-h-[100dvh] overflow-x-clip bg-[#201f31] text-white">
    <AppHeader />

    <div id="wrapper" class="mx-auto w-full pt-[100px] max-[1299px]:pt-0">
      <main id="main-wrapper" class="mx-auto mb-[70px] w-full max-w-[1800px] px-[15px] max-[759px]:mb-[30px] max-[759px]:inline-block">
        <section class="mb-12 text-[15px] leading-[1.45] max-[759px]:mb-[67px]">
          <strong class="block text-sm font-semibold text-[#ffbade]">Share HiAnime</strong>
          <p class="m-0 text-white">to your friends</p>
        </section>

        <div class="flow-root">
          <section id="main-content" class="float-left w-3/4 max-[1199px]:float-none max-[1199px]:w-full">
            <div class="block_area mb-12 max-[759px]:mb-[30px]">
              <div class="block_area-header mb-4 flex items-center justify-between max-[759px]:relative max-[759px]:mb-0">
                <h1 class="m-0 p-0 text-[22px] font-semibold leading-[1.3] text-[#ffbade]">Most Popular</h1>
              </div>

              <div class="film_list">
                <div class="film_list-wrap -mx-2 -my-3 flex flex-wrap">
                  <article
                    v-for="item in data.items"
                    :key="item.id"
                    class="flw-item mx-2 my-[11.2px] w-[calc(16.66%_-_1rem)] min-w-0 transition-all duration-200 max-[1599px]:w-[calc(25%_-_1rem)] max-[759px]:w-[calc(50%_-_1rem)]"
                  >
                    <ULink raw :to="detailPath(item)" class="group film-poster relative mb-2 block w-full overflow-hidden bg-white/10 pb-[140%]" :aria-label="item.displayTitle">
                      <img :src="item.coverImage" :alt="item.displayTitle" loading="lazy" class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105">
                      <span class="absolute inset-x-0 bottom-0 z-[2] h-3/5 bg-[linear-gradient(0deg,#201f31_0%,rgba(32,31,49,0)_40%)]" />
                      <span class="absolute inset-0 z-[3] bg-black/30 opacity-0 backdrop-blur-[10px] transition-opacity duration-500 group-hover:opacity-100 max-[759px]:hidden" />
                      <UIcon name="i-lucide-play" class="absolute left-1/2 top-1/2 z-[4] size-[30px] -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-[759px]:hidden" />
                      <MetaBadges :media="item" class="absolute bottom-2.5 left-2.5 z-[5]" />
                    </ULink>

                    <ULink raw :to="detailPath(item)" class="film-name mb-2 block truncate text-[14.4px] font-medium leading-[18.72px] text-[#aaa] hover:text-[#ffbade]">
                      {{ item.displayTitle }}
                    </ULink>
                    <p class="m-0 truncate text-[13px] leading-[1.4] text-[#aaa]">
                      {{ formatKind(item.badges.format) }} / {{ formatDuration(item.badges.duration) }}
                    </p>
                  </article>
                </div>
              </div>

              <nav class="pagination mb-4 mt-9 flex flex-wrap items-center" aria-label="Most popular pages">
                <UButton
                  v-for="item in pageItems"
                  :key="item"
                  :to="pagePath(item)"
                  size="lg"
                  color="neutral"
                  variant="soft"
                  class="m-[5px] h-10 min-w-10 rounded-full px-2.5 text-center text-base font-semibold leading-10 ring-0"
                  :class="item === page ? 'bg-[#ffbade] text-[#111] hover:bg-[#ffbade]' : 'bg-white/[0.05] text-[#999] hover:bg-white/[0.05] hover:text-[#ffbade]'"
                >
                  {{ item }}
                </UButton>
                <UButton
                  v-if="data.hasNextPage"
                  size="lg"
                  color="neutral"
                  variant="soft"
                  class="m-[5px] h-10 min-w-10 rounded-full bg-white/[0.05] px-2.5 text-center text-base font-semibold leading-10 text-[#999] ring-0 hover:bg-white/[0.05] hover:text-[#ffbade]"
                  aria-label="Next page"
                  @click="goToPage(page + 1)"
                >
                  &rsaquo;
                </UButton>
              </nav>
            </div>
          </section>

          <aside id="main-sidebar" class="float-right w-1/4 pl-[30px] max-[1199px]:float-none max-[1199px]:w-full max-[1199px]:pl-0">
            <section class="anif-block mb-5 min-h-[300px]">
              <h2 class="anif-block-header relative mb-4 text-[22px] font-semibold text-[#ffbade]">Top 10</h2>
              <div class="mb-4 flex overflow-hidden rounded bg-white/10 text-[13px] font-medium">
                <span class="flex-1 bg-[#ffbade] px-3 py-2 text-center text-[#111]">Today</span>
                <span class="flex-1 px-3 py-2 text-center text-[#ddd]">Week</span>
                <span class="flex-1 px-3 py-2 text-center text-[#ddd]">Month</span>
              </div>

              <ol class="cbox cbox-list anif-block-ul anif-block-chart m-0 list-none bg-white/[0.05] p-0">
                <li v-for="(item, index) in topItems" :key="item.id" class="relative ml-10 flex items-center justify-between border-b border-white/[0.05] bg-transparent py-4 pr-0 last:border-b-0">
                  <span class="film-number absolute left-[-40px] top-1/2 w-10 -translate-y-1/2 text-left">
                    <span class="inline-block text-xl font-semibold text-white/40" :class="{ 'border-b-[3px] border-[#ffbade] pb-1.5 text-white': index < 3 }">{{ index + 1 }}</span>
                  </span>
                  <ULink raw :to="detailPath(item)" class="film-poster relative z-[2] block w-[60px] shrink-0 overflow-hidden rounded-[5px] bg-white/10 pb-[76px]">
                    <img :src="item.coverImage" :alt="item.displayTitle" loading="lazy" class="absolute inset-0 size-full object-cover">
                  </ULink>
                  <span class="film-detail relative z-[2] min-w-0 flex-1 px-4 text-[13px] text-[#aaa]">
                    <ULink raw :to="detailPath(item)" class="film-name mb-[0.4rem] line-clamp-2 text-[13px] font-medium leading-normal text-[#ddd] hover:text-[#ffbade]">
                      {{ item.displayTitle }}
                    </ULink>
                    <small class="block truncate text-xs text-[#aaa]">{{ formatKind(item.badges.format) }} / {{ formatDuration(item.badges.duration) }}</small>
                  </span>
                </li>
              </ol>
            </section>
          </aside>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>
