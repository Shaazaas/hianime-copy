<script setup lang="ts">
import type { AnimeDetail, HomeCatalog } from '@/types/anime'
import { detailPath, formatDuration, formatKind, idFromSlug } from '@/utils/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import EpisodeRail from '@/components/catalog/EpisodeRail.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'
import WatchShell from '@/components/catalog/WatchShell.vue'

const route = useRoute()
const id = computed(() => idFromSlug(route.params.slug))
const selected = computed(() => Math.max(1, Number.parseInt(String(route.query.ep || '1'), 10) || 1))
const playerExpanded = ref(false)

if (!id.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

const { data: media } = await useFetch<AnimeDetail>(() => `/api/anilist/media/${id.value}`)
const { data: home } = await useFetch<HomeCatalog>('/api/anilist/home')

if (!media.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

const seo = computed(() => hianimeWatchSeo(media.value?.displayTitle || 'Anime'))

useHianimeSeo({
  title: () => seo.value.title,
  description: () => seo.value.description,
  keywords: () => seo.value.keywords
})
</script>

<template>
  <div v-if="media" class="min-h-screen overflow-x-clip bg-[var(--catalog-bg)] text-default">
    <AppHeader />
    <main class="relative mx-auto w-full max-w-[1800px] overflow-hidden px-[15px] pb-12 pt-[95px] max-[1299px]:pt-0">
      <div class="pointer-events-none absolute inset-0 overflow-hidden grayscale">
        <div
          class="absolute inset-0 bg-cover bg-center opacity-[.35] blur-[20px]"
          :style="{ backgroundImage: `url(${media.coverImage})`, transform: 'scale(1.2)' }"
        />
      </div>
      <nav class="relative z-[3] mb-[22px] mt-0 flex flex-wrap items-center text-sm font-light leading-[1.4] text-[#ddd] max-[1199px]:hidden" aria-label="Breadcrumb">
        <ULink raw to="/home" class="hover:text-[#ffbade]">Home</ULink>
        <span class="px-2 text-[#aaa]">•</span>
        <ULink raw to="/filter?format=TV" class="hover:text-[#ffbade]">TV</ULink>
        <span class="px-2 text-[#aaa]">•</span>
        <span class="text-[#aaa]">Watching {{ media.displayTitle }}</span>
      </nav>

      <section
        class="relative z-[3] grid items-start gap-0"
        :class="playerExpanded ? 'watch-stage-expanded' : 'watch-stage'"
      >
        <div class="watch-episodes">
          <EpisodeRail :media="media" :selected="selected" />
        </div>
        <div class="watch-player">
          <WatchShell v-model:expanded="playerExpanded" :media="media" :selected="selected" />
        </div>
        <aside v-if="!playerExpanded" class="watch-detail px-0 pb-0 pt-[25px] text-white max-[1400px]:col-span-full max-[1400px]:py-[35px] max-[1199px]:px-2.5 max-[1199px]:py-[25px]">
          <article class="max-[1400px]:grid max-[1400px]:min-h-[120px] max-[1400px]:grid-cols-[80px_minmax(0,1fr)] max-[1400px]:gap-5 max-[520px]:grid-cols-[70px_minmax(0,1fr)]">
            <img class="mb-[30px] aspect-[2/3] w-[120px] object-cover shadow-[0_40px_40px_rgba(0,0,0,.2)] max-[1400px]:mb-0 max-[1400px]:w-20 max-[520px]:w-[70px]" :src="media.coverImage" :alt="media.displayTitle">
            <div class="min-w-0">
              <h1 class="mb-[15px] line-clamp-3 text-xl font-medium leading-[1.1] text-white max-[479px]:text-base">{{ media.displayTitle }}</h1>
              <div class="mb-5 flex flex-wrap items-center gap-0 text-xs font-semibold max-[1400px]:mb-2.5">
                <span class="flex h-5 items-center rounded-l bg-white px-1.5 font-[Arial] text-xs leading-none text-[#111]">{{ media.badges.averageScore ? 'PG-13' : 'PG' }}</span>
                <span class="ml-0.5 flex h-5 items-center bg-[#ffbade] px-1.5 font-[Arial] text-xs leading-none text-[#111]">HD</span>
                <span class="ml-0.5 flex h-5 items-center bg-[#b0e3af] px-1.5 font-[Arial] text-xs leading-none text-[#111]"><UIcon name="i-lucide-captions" class="mr-1 size-3" />{{ selected }}</span>
                <span class="ml-0.5 flex h-5 items-center bg-[#b9e7ff] px-1.5 font-[Arial] text-xs leading-none text-[#111]"><UIcon name="i-lucide-mic" class="mr-1 size-3" />{{ Math.min((media.badges.episodes || selected), selected + 1) }}</span>
                <span class="ml-0.5 flex h-5 items-center rounded-r bg-white/20 px-1.5 font-[Arial] text-xs leading-none text-white">{{ media.badges.episodes || '?' }}</span>
                <span class="mx-2 size-1 rounded-full bg-white/30" />
                <span class="my-1 text-white/75">{{ formatKind(media.badges.format) }}</span>
                <span class="mx-2 size-1 rounded-full bg-white/30" />
                <span class="my-1 text-white/75">{{ formatDuration(media.badges.duration) }}</span>
              </div>
              <p class="line-clamp-4 max-h-[100px] min-h-20 overflow-auto text-[13px] font-light leading-[1.5] text-white/70 max-[860px]:hidden">{{ media.description }}</p>
              <p class="mt-[15px] text-[13px] font-light leading-[1.5] text-white/75 max-[860px]:hidden">
                HiAnime is the best site to watch <strong>{{ media.displayTitle }}</strong> SUB online, or you can even watch <strong>{{ media.displayTitle }}</strong> DUB in HD quality.
                <span v-if="media.studios.length">You can also find <strong class="text-[#ffbade]">{{ media.studios[0] }}</strong> anime on HiAnime website.</span>
              </p>
              <UButton :to="detailPath(media)" size="xs" color="neutral" variant="solid" trailing-icon="i-lucide-chevron-right" class="mt-4 h-8 rounded-md bg-white px-3 text-xs text-[#111] hover:bg-white">
                View detail
              </UButton>
              <a href="#comment-block" class="mt-4 flex max-w-[200px] items-center gap-3 rounded-[10px] bg-white/25 p-[15px] text-[13px] text-white max-[1400px]:hidden">
                <UIcon name="i-lucide-message-circle" class="size-5 text-[#ffbade]" />
                Comments
              </a>
            </div>
          </article>
        </aside>
      </section>

      <section class="relative z-[3] bg-[#191826]">
        <div class="flex min-h-[78px] items-center px-0 py-5 max-[640px]:min-h-0 max-[640px]:py-4">
          <div class="mr-4 size-10 rounded-full bg-white/10 max-[640px]:hidden" />
          <div class="mr-3">
            <strong class="block text-sm font-semibold text-[#ffbade]">Share Anime</strong>
            <span class="text-[13px] text-white/55">to your friends</span>
          </div>
        </div>
      </section>

      <section id="comment-block" class="relative z-[3] mt-8 grid grid-cols-[minmax(0,1fr)_calc(25%_-_30px)] gap-[30px] max-[1199px]:grid-cols-1">
        <div>
          <div class="mb-6 flex items-center justify-start">
            <div class="mr-4">
              <h2 class="m-0 text-[22px] font-semibold leading-[1.3] text-[#ffbade]">Comments</h2>
            </div>
            <a class="text-[13px] text-white/65 hover:text-[#ffbade]" href="/filter">
              Community Guidelines <span class="font-semibold text-[#ffbade]">NEW</span>
            </a>
          </div>
          <div class="bg-[#2d2b44] p-5">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-message-circle" class="size-6 text-[#ffbade]" />
              <div>
                <strong class="block text-base font-semibold text-white">Comments</strong>
                <span class="text-xs text-white/45">Community discussion is not connected in this catalog copy.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="relative z-[3] mt-8 grid grid-cols-[minmax(0,1fr)_330px] gap-8 max-[1080px]:grid-cols-1">
        <div>
          <SectionHeader title="Recommended for you" />
          <div class="grid grid-cols-6 gap-x-4 gap-y-6 max-[1320px]:grid-cols-5 max-[980px]:grid-cols-4 max-[760px]:grid-cols-3 max-[520px]:grid-cols-2">
            <AnimeCard v-for="item in media.recommendations.slice(0, 18)" :key="item.id" :media="item" />
          </div>
        </div>

        <aside v-if="home" class="max-[1080px]:hidden">
          <SectionHeader title="Most Popular" />
          <div class="bg-[#2d2b44] px-[15px]">
            <ULink
              v-for="(item, index) in home.top.slice(0, 10)"
              :key="item.id"
              raw
              :to="detailPath(item)"
              class="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-white/10 py-3 text-white hover:text-[#ffbade]"
            >
              <span class="pt-0.5 text-[22px] font-semibold leading-none text-[#ffbade]">{{ index + 1 }}</span>
              <span class="min-w-0">
                <strong class="line-clamp-2 text-sm font-semibold leading-tight">{{ item.displayTitle }}</strong>
                <small class="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                  <span>{{ item.badges.episodes || '?' }}</span>
                  <span class="size-1 rounded-full bg-white/25" />
                  <span>{{ item.badges.format || 'TV' }}</span>
                  <span class="size-1 rounded-full bg-white/25" />
                  <span>{{ formatDuration(item.badges.duration) }}</span>
                </small>
              </span>
            </ULink>
          </div>
        </aside>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
