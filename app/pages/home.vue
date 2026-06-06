<script setup lang="ts">
import type { AnimeListItem, HomeCatalog } from '@/types/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import HomeHero from '@/components/catalog/HomeHero.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'
import TrendingCarousel from '@/components/catalog/TrendingCarousel.vue'
import { detailPath, formatDuration, formatKind } from '@/utils/anime'

definePageMeta({
  viewTransition: {
    enabled: true,
    toTypes: (_to, from) => from.path.startsWith('/anime/') ? ['catalog-return'] : [],
    fromTypes: (to) => to.path.startsWith('/anime/') ? ['catalog-drill'] : []
  }
})

const { data } = await useFetch<HomeCatalog>('/api/anilist/home', {
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

useHianimeSeo({
  ...hianimeHomeSeo
})

const latestEpisodes = computed(() => data.value.recommended.slice(0, 18))
const newOnHianime = computed(() => [
  ...data.value.trending,
  ...data.value.popular,
  ...data.value.favourites
].slice(0, 18))
const genreList = computed(() => {
  const genres = new Set<string>()
  const sources = [
    ...data.value.trending,
    ...data.value.recommended,
    ...data.value.popular,
    ...data.value.favourites,
    ...data.value.topAiring
  ]

  for (const item of sources) {
    for (const genre of item.genres) genres.add(genre)
  }

  return [...genres].slice(0, 38)
})

function gridItems(items: AnimeListItem[], count = 12) {
  return items.slice(0, count)
}
</script>

<template>
  <div class="min-h-[100dvh] overflow-x-clip bg-[#201f31] text-white">
    <AppHeader />

    <div class="pt-[70px]">
      <HomeHero :items="data.spotlight" />

      <main id="main-content" class="mx-auto w-full max-w-[1800px] px-[15px]">
        <TrendingCarousel :items="data.trending" />

        <section class="mb-10">
          <div class="text-xs">
            <strong class="block text-sm font-semibold text-[#ffbade]">Share HiAnime</strong>
            <p class="mb-0 text-white">to your friends</p>
          </div>
        </section>

        <section class="mb-10 bg-white/[0.04] px-5 py-8 max-[760px]:mx-[-15px] max-[760px]:flex max-[760px]:justify-center">
          <div class="flex items-center gap-5">
            <img src="/images/discussion.png" alt="" width="601" height="601" class="size-16 shrink-0">
            <label class="inline-flex min-w-[190px] items-center justify-between gap-5 rounded-lg border border-white/20 px-4 py-2 text-base font-semibold leading-tight text-white">
              Show<br>Comments
              <input type="checkbox" class="peer sr-only" aria-label="Show comments">
              <span class="relative h-5 w-10 rounded-full bg-white/20 after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-[#aaa] after:transition-transform peer-checked:bg-[#ffbade] peer-checked:after:translate-x-5 peer-checked:after:bg-[#111]" />
            </label>
          </div>
        </section>

        <div class="grid grid-cols-[minmax(0,1fr)_360px] gap-10 max-[1180px]:grid-cols-1">
          <div id="main-left" class="min-w-0">
            <section class="mb-12">
              <SectionHeader title="Top Airing" to="/filter?status=airing" />
              <div class="grid grid-cols-6 gap-x-4 gap-y-5 max-[1320px]:grid-cols-5 max-[980px]:grid-cols-4 max-[760px]:grid-cols-3 max-[520px]:grid-cols-2">
                <AnimeCard v-for="item in gridItems(data.topAiring, 12)" :key="item.id" :media="item" />
              </div>
            </section>

            <section class="mb-12">
              <div class="mb-4 flex flex-wrap items-center gap-3">
                <h2 class="mr-2 text-[22px] font-semibold leading-[1.3] text-[#ffbade]">Latest Episodes</h2>
                <UButton to="/filter?status=airing" size="sm" class="rounded bg-[#ffbade] px-3 py-1 text-xs font-medium text-[#111] ring-0">All</UButton>
                <UButton to="/filter?format=TV" size="sm" color="neutral" variant="soft" class="rounded bg-white/10 px-3 py-1 text-xs font-medium text-white ring-0">TV</UButton>
                <UButton to="/filter?sort=popular" size="sm" color="neutral" variant="soft" class="rounded bg-white/10 px-3 py-1 text-xs font-medium text-white ring-0">Popular</UButton>
              </div>
              <div class="grid grid-cols-6 gap-x-4 gap-y-5 max-[1320px]:grid-cols-5 max-[980px]:grid-cols-4 max-[760px]:grid-cols-3 max-[520px]:grid-cols-2">
                <AnimeCard v-for="item in latestEpisodes" :key="item.id" :media="item" />
              </div>
            </section>

            <section class="mb-12">
              <SectionHeader title="New On HiAnime" to="/filter?sort=popular" />
              <div class="grid grid-cols-6 gap-x-4 gap-y-5 max-[1320px]:grid-cols-5 max-[980px]:grid-cols-4 max-[760px]:grid-cols-3 max-[520px]:grid-cols-2">
                <AnimeCard v-for="item in newOnHianime" :key="item.id" :media="item" />
              </div>
            </section>
          </div>

          <aside id="main-sidebar" class="min-w-0">
            <section class="mb-10">
              <SectionHeader title="Genres" />
              <div class="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <ULink v-for="genre in genreList" :key="genre" raw :to="`/filter?genre=${encodeURIComponent(genre)}`" class="truncate text-[#ddd] hover:text-[#ffbade]">
                  {{ genre }}
                </ULink>
              </div>
            </section>

            <section class="mb-10">
              <SectionHeader title="Top 10" />
              <div class="rounded bg-white/[0.04]">
                <ULink v-for="(item, index) in data.top.slice(0, 10)" :key="item.id" raw :to="detailPath(item)" class="grid grid-cols-[34px_54px_minmax(0,1fr)] gap-3 border-b border-white/10 p-3 last:border-b-0 hover:bg-white/[0.04]">
                  <span class="pt-1 text-xl font-semibold text-[#ffbade]">{{ index + 1 }}</span>
                  <img :src="item.coverImage" :alt="item.displayTitle" class="h-[72px] w-[54px] object-cover" loading="lazy">
                  <span class="min-w-0">
                    <strong class="line-clamp-2 text-sm font-medium leading-tight text-white">{{ item.displayTitle }}</strong>
                    <small class="mt-1 block truncate text-xs text-[#aaa]">{{ formatKind(item.badges.format) }} / {{ formatDuration(item.badges.duration) }}</small>
                  </span>
                </ULink>
              </div>
            </section>

            <section class="mb-10 overflow-hidden rounded bg-[#3a3951]">
              <img src="/images/download-apk.webp" alt="HiAnime catalog artwork" width="565" height="835" class="w-full">
              <div class="p-5">
                <h2 class="mb-2 text-xl font-semibold text-[#ffbade]">HiAnime Catalog</h2>
                <p class="text-sm text-[#ddd]">Fast browsing, compact cards, and anime discovery in one place.</p>
              </div>
            </section>

            <section class="mb-10">
              <SectionHeader title="Airing Now" />
              <div class="grid gap-3">
                <ULink v-for="item in data.schedule.slice(0, 4)" :key="item.id" raw :to="detailPath(item)" class="rounded bg-white/[0.05] p-4 hover:bg-white/[0.08]">
                  <h3 class="line-clamp-2 text-sm font-medium leading-snug text-white">{{ item.displayTitle }}</h3>
                  <p class="mt-2 text-xs text-[#aaa]">{{ formatKind(item.badges.format) }} / {{ formatDuration(item.badges.duration) }}</p>
                </ULink>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>
