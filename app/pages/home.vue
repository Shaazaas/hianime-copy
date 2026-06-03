<script setup lang="ts">
import type { AnimeListItem, HomeCatalog } from '@/types/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import HomeHero from '@/components/catalog/HomeHero.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'
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

useSeoMeta({
  title: 'HiAnime Free Anime Streaming Homepage',
  description: 'Browse trending, popular, airing, completed, and recommended anime from an AniList-backed HiAnime catalog.',
  ogTitle: 'HiAnime Free Anime Streaming Homepage',
  ogDescription: 'Browse trending, popular, airing, completed, and recommended anime from an AniList-backed HiAnime catalog.',
  ogImage: '/images/hianime-archive-logo.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/hianime-archive-logo.png'
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

const sidebarPosts = [
  'Best anime to watch with friends',
  'Fall simulcast picks worth tracking',
  'Community watch rooms are open',
  'How to find subbed and dubbed titles'
]

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
        <section class="mb-10">
          <SectionHeader title="Trending" to="/filter?sort=trending" />
        </section>

        <section class="mb-10 grid min-h-[90px] place-items-center md:mt-20">
          <div class="flex w-[min(728px,100%)] items-center overflow-hidden bg-[#12131f] shadow-[0_14px_30px_rgba(0,0,0,.16)] max-[520px]:mx-[-15px] max-[520px]:w-[calc(100%+30px)]">
            <div class="grid h-[90px] flex-1 grid-cols-5 overflow-hidden max-[520px]:h-[47px]">
              <img v-for="item in data.trending.slice(0, 5)" :key="item.id" :src="item.coverImage" :alt="item.displayTitle" class="h-full w-full object-cover opacity-82">
            </div>
            <div class="flex h-[90px] min-w-[268px] items-center justify-center bg-[#293dc6] px-5 text-center text-[22px] font-semibold leading-tight text-white max-[520px]:h-[47px] max-[520px]:min-w-[156px] max-[520px]:text-xs">
              Free Movies & Series<br>Streaming Online HD
            </div>
            <ULink raw to="/filter" class="grid h-[90px] w-[118px] place-items-center bg-[#ffdf1f] text-lg font-semibold text-black max-[520px]:h-[47px] max-[520px]:w-[72px] max-[520px]:text-xs">
              WATCH
            </ULink>
          </div>
        </section>

        <section class="mb-10">
          <div class="text-xs">
            <strong class="block text-sm font-semibold text-[#ffbade]">Share HiAnime</strong>
            <p class="mb-0 text-white">to your friends</p>
          </div>
        </section>

        <section class="mb-10 bg-white/[0.04] px-5 py-8 max-[760px]:mx-[-15px] max-[760px]:flex max-[760px]:justify-center">
          <label class="inline-flex min-w-[190px] items-center justify-between gap-5 rounded-lg border border-white/20 px-4 py-2 text-base font-semibold leading-tight text-white">
            Show<br>Comments
            <input type="checkbox" class="peer sr-only" aria-label="Show comments">
            <span class="relative h-5 w-10 rounded-full bg-white/20 after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-[#aaa] after:transition-transform peer-checked:bg-[#ffbade] peer-checked:after:translate-x-5 peer-checked:after:bg-[#111]" />
          </label>
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
                <UButton to="/filter?format=TV" size="sm" color="neutral" variant="soft" class="rounded bg-white/10 px-3 py-1 text-xs font-medium text-white ring-0">Subbed</UButton>
                <UButton to="/filter?sort=popular" size="sm" color="neutral" variant="soft" class="rounded bg-white/10 px-3 py-1 text-xs font-medium text-white ring-0">Dubbed</UButton>
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
              <img src="/images/hianime-download-apk.webp" alt="Download HiAnime app" width="500" height="210" class="w-full">
              <div class="p-5">
                <h2 class="mb-2 text-xl font-semibold text-[#ffbade]">HiAnime App</h2>
                <p class="text-sm text-[#ddd]">Fast browsing, compact cards, and anime discovery in one place.</p>
              </div>
            </section>

            <section class="mb-10">
              <SectionHeader title="Community" />
              <div class="grid gap-3">
                <article v-for="post in sidebarPosts" :key="post" class="rounded bg-white/[0.05] p-4">
                  <h3 class="line-clamp-2 text-sm font-medium leading-snug text-white">{{ post }}</h3>
                  <p class="mt-2 text-xs text-[#aaa]">Join the discussion</p>
                </article>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>
