<script setup lang="ts">
import type { AnimeDetail } from '@/types/anime'
import { detailPath, formatDateLabel, formatDuration, formatKind, idFromSlug } from '@/utils/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import EpisodeRail from '@/components/catalog/EpisodeRail.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'
import WatchShell from '@/components/catalog/WatchShell.vue'

const route = useRoute()
const id = computed(() => idFromSlug(route.params.slug))
const selected = computed(() => Math.max(1, Number.parseInt(String(route.query.ep || '1'), 10) || 1))

if (!id.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

const { data: media } = await useFetch<AnimeDetail>(() => `/api/anilist/media/${id.value}`)

if (!media.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

useSeoMeta({
  title: () => media.value ? `Watch ${media.value.displayTitle} Episode ${selected.value}` : 'Watch'
})
</script>

<template>
  <div v-if="media" class="min-h-screen overflow-x-clip bg-[var(--catalog-bg)] text-default">
    <AppHeader />
    <UContainer as="main" class="max-w-[1540px] py-7">
      <section class="grid grid-cols-[220px_minmax(420px,1fr)_340px] items-start gap-6 max-[1060px]:grid-cols-[minmax(0,1fr)_320px] max-[820px]:grid-cols-1">
        <aside class="catalog-surface rounded-md p-4 max-[1060px]:col-span-full max-[1060px]:grid max-[1060px]:grid-cols-[150px_minmax(0,1fr)] max-[1060px]:gap-5 max-[560px]:grid-cols-1">
          <img class="aspect-[2/3] w-full rounded object-cover max-[1060px]:w-[150px] max-[560px]:w-full" :src="media.coverImage" :alt="media.displayTitle">
          <div class="min-w-0">
            <p class="mt-4 text-xs font-semibold text-muted max-[1060px]:mt-0">Home / TV / {{ media.displayTitle }}</p>
            <h1 class="mt-3 text-2xl font-black leading-tight text-white">{{ media.displayTitle }}</h1>
            <h2 v-if="media.nativeTitle" class="mt-1 text-sm font-semibold text-muted">{{ media.nativeTitle }}</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft" class="rounded-md">{{ media.badges.episodes || '?' }}</UBadge>
              <UBadge color="neutral" variant="soft" class="rounded-md">{{ media.badges.averageScore || 'NA' }}</UBadge>
              <UBadge color="neutral" variant="soft" class="rounded-md">{{ formatKind(media.badges.status) }}</UBadge>
            </div>
            <p class="mt-4 line-clamp-[10] text-sm leading-relaxed text-default">{{ media.description }}</p>

            <dl class="mt-5 grid gap-2 text-xs">
              <div class="grid grid-cols-[86px_minmax(0,1fr)] gap-2">
                <dt class="text-muted">Start Date:</dt>
                <dd class="truncate text-default">{{ formatDateLabel(media.startDate) }}</dd>
              </div>
              <div class="grid grid-cols-[86px_minmax(0,1fr)] gap-2">
                <dt class="text-muted">Genres:</dt>
                <dd class="truncate text-default">{{ media.genres.join(', ') || 'Unknown' }}</dd>
              </div>
              <div class="grid grid-cols-[86px_minmax(0,1fr)] gap-2">
                <dt class="text-muted">Duration:</dt>
                <dd class="truncate text-default">{{ formatDuration(media.badges.duration) }}</dd>
              </div>
              <div class="grid grid-cols-[86px_minmax(0,1fr)] gap-2">
                <dt class="text-muted">Studios:</dt>
                <dd class="truncate text-default">{{ media.studios.join(', ') || 'Unknown' }}</dd>
              </div>
            </dl>

            <UButton :to="detailPath(media)" size="sm" color="neutral" variant="soft" class="mt-5 w-full justify-center">
              View Details
            </UButton>
          </div>
        </aside>

        <WatchShell :media="media" :selected="selected" />
        <EpisodeRail :media="media" :selected="selected" />
      </section>

      <section class="mt-10 grid grid-cols-[minmax(0,1fr)_330px] gap-8 max-[980px]:grid-cols-1">
        <div>
          <SectionHeader title="Episode Details" />
          <div class="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
            <UCard variant="subtle" class="catalog-surface" :ui="{ body: 'grid gap-2 text-sm' }">
              <strong class="text-highlighted">Catalog Metadata</strong>
              <p class="text-default">This page uses AniList metadata for episode navigation, title context, and recommendations.</p>
              <p class="text-muted">No streaming or community service is connected.</p>
            </UCard>
            <UCard variant="subtle" class="catalog-surface" :ui="{ body: 'grid gap-2 text-sm' }">
              <strong class="text-highlighted">Release Context</strong>
              <p class="text-default">Started {{ formatDateLabel(media.startDate) }} / {{ formatKind(media.badges.status) }}</p>
              <p class="text-muted">{{ media.studios.join(', ') || 'Studio unknown' }}</p>
            </UCard>
          </div>
        </div>

        <aside>
          <SectionHeader title="Recommendations" />
          <div class="grid grid-cols-2 gap-4 max-[520px]:grid-cols-2">
            <AnimeCard v-for="item in media.recommendations" :key="item.id" :media="item" />
          </div>
        </aside>
      </section>
    </UContainer>
    <AppFooter />
  </div>
</template>
