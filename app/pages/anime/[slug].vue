<script setup lang="ts">
import type { AnimeDetail, HomeCatalog } from '@/types/anime'
import { idFromSlug } from '@/utils/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import CharacterGrid from '@/components/catalog/CharacterGrid.vue'
import DetailHero from '@/components/catalog/DetailHero.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'

definePageMeta({
  viewTransition: {
    enabled: true,
    toTypes: (_to, from) => {
      if (from.path === '/' || from.path === '/home') return ['catalog-drill']
      if (from.path.startsWith('/anime/')) return ['catalog-detail']

      return []
    },
    fromTypes: (to) => {
      if (to.path === '/' || to.path === '/home') return ['catalog-return']
      if (to.path.startsWith('/anime/')) return ['catalog-detail']

      return []
    }
  }
})

const route = useRoute()
const id = computed(() => idFromSlug(route.params.slug))

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

const seasonLinks = computed(() => {
  const current = media.value
  if (!current) return []

  const seasonMatch = current.displayTitle.match(/(?:season\s+(\d+)|(\d+)(?:st|nd|rd|th)\s+season)/i)
  const currentSeason = seasonMatch ? Number.parseInt(seasonMatch[1] || seasonMatch[2] || '1', 10) : null
  if (!currentSeason) return []

  const baseTitle = current.displayTitle
    .replace(/\s+season\s+\d+\b/i, '')
    .replace(/\s+\d+(?:st|nd|rd|th)\s+season\b/i, '')
    .trim()
  const total = Math.max(currentSeason, 4)

  return Array.from({ length: total }, (_, index) => {
    const season = index + 1
    return {
      season,
      label: `Season ${season}`,
      active: season === currentSeason,
      to: season === currentSeason ? `/anime/${current.slug}` : `/filter?search=${encodeURIComponent(`${baseTitle} Season ${season}`)}`
    }
  })
})
</script>

<template>
  <div v-if="media" class="min-h-[100dvh] overflow-x-clip bg-[var(--catalog-bg)] text-white">
    <CatalogMotion />
    <AppHeader />
    <main>
      <DetailHero :media="media" />

      <div class="mx-auto grid w-full max-w-[1300px] grid-cols-[minmax(0,1fr)_330px] gap-9 px-[15px] py-10 max-[1120px]:grid-cols-1 max-[760px]:py-8">
        <div class="grid gap-12 max-[760px]:gap-10">
          <section v-if="seasonLinks.length">
            <SectionHeader title="More Seasons" />
            <div class="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
              <ULink
                v-for="item in seasonLinks"
                :key="item.season"
                raw
                :to="item.to"
                class="group flex min-h-[72px] items-center gap-3 bg-white/[0.06] p-3 text-white transition-colors duration-200 hover:bg-white/[0.1] hover:text-primary max-[520px]:min-h-[64px]"
                :class="{ 'bg-[var(--ui-color-primary-500)] text-[#111] hover:text-[#111]': item.active }"
              >
                <span class="grid size-10 shrink-0 place-items-center bg-black/20 text-sm font-semibold" :class="{ 'bg-[#111]/10': item.active }">{{ item.season }}</span>
                <span class="min-w-0">
                  <strong class="block truncate text-sm font-semibold">{{ item.label }}</strong>
                  <small class="block truncate text-xs opacity-70">{{ item.active ? 'Current season' : media.displayTitle.replace(/Season\s+\d+/i, item.label) }}</small>
                </span>
              </ULink>
            </div>
          </section>

          <section>
            <SectionHeader title="Recommended for you" />
            <div class="grid grid-cols-6 gap-x-4 gap-y-5 max-[1180px]:grid-cols-5 max-[980px]:grid-cols-4 max-[760px]:grid-cols-3 max-[520px]:grid-cols-2">
              <AnimeCard v-for="item in media.recommendations" :key="item.id" :media="item" />
            </div>
          </section>

          <CharacterGrid :characters="media.characters" />
        </div>

        <aside v-if="home" class="grid content-start gap-3 max-[1120px]:hidden">
          <SectionHeader title="Most Popular" />
          <ULink v-for="(item, index) in home.top.slice(0, 10)" :key="item.id" raw :to="`/anime/${item.slug}`" class="grid grid-cols-[32px_48px_minmax(0,1fr)] gap-3 border-b border-white/10 py-3 text-white hover:text-primary">
            <span class="pt-1 text-xl font-semibold text-primary">{{ index + 1 }}</span>
            <img :src="item.coverImage" :alt="item.displayTitle" class="h-16 w-12 object-cover" loading="lazy">
            <span class="min-w-0">
              <strong class="line-clamp-2 text-sm font-medium leading-tight">{{ item.displayTitle }}</strong>
              <small class="mt-1 block truncate text-xs text-white/55">{{ item.badges.format || 'TV' }} / {{ item.badges.duration ? `${item.badges.duration}m` : 'Unknown' }}</small>
            </span>
          </ULink>
        </aside>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
