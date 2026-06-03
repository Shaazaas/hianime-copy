<script setup lang="ts">
import type { AnimeDetail } from '@/types/anime'
import { formatDuration } from '@/utils/anime'

const props = defineProps<{
  media: AnimeDetail
  selected: number
}>()

const nextEpisode = computed(() => {
  const count = props.media.badges.episodes || props.selected + 1

  return Math.min(props.selected + 1, count)
})
</script>

<template>
  <section class="min-w-0">
    <div class="catalog-surface overflow-hidden rounded-md">
      <div class="relative grid aspect-video place-content-center overflow-hidden bg-black text-center text-white">
        <img
          v-if="media.bannerImage"
          class="absolute inset-0 h-full w-full object-cover opacity-25 blur-sm"
          :src="media.bannerImage"
          :alt="media.displayTitle"
        >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.78)_70%)]" />
        <div class="relative mx-auto grid max-w-sm gap-2 px-5">
          <UIcon name="i-lucide-info" class="mx-auto size-14 text-primary" />
          <p class="text-xl font-black leading-tight text-white">Episode {{ selected }}</p>
          <span class="text-sm text-default">Episode metadata view. Streaming is not available in this AniList-only catalog.</span>
        </div>
      </div>
    </div>

    <div class="catalog-surface mt-5 grid grid-cols-3 gap-3 rounded-md p-4 text-center max-[620px]:grid-cols-1">
      <div>
        <strong class="block text-xs font-semibold text-muted">Episode</strong>
        <span class="mt-1 block text-sm font-bold text-default">{{ selected }} of {{ media.badges.episodes || 'unknown' }}</span>
      </div>
      <div>
        <strong class="block text-xs font-semibold text-muted">Duration</strong>
        <span class="mt-1 block text-sm font-bold text-default">{{ formatDuration(media.badges.duration) }}</span>
      </div>
      <div>
        <strong class="block text-xs font-semibold text-muted">Status</strong>
        <span class="mt-1 block text-sm font-bold text-default">{{ media.badges.status ? media.badges.status.replaceAll('_', ' ') : 'Unknown' }}</span>
      </div>
    </div>

    <div class="catalog-surface mt-5 rounded-md p-4 text-center text-sm text-default">
      <p>{{ nextEpisode !== selected ? 'Continue to the next listed catalog episode.' : 'You are viewing the latest listed episode for this title.' }}</p>
      <p class="mt-1 text-xs text-muted">
        Duration: {{ formatDuration(media.badges.duration) }}
      </p>
      <UButton
        v-if="nextEpisode !== selected"
        :to="`/watch/${media.slug}?ep=${nextEpisode}`"
        size="xs"
        color="neutral"
        variant="soft"
        trailing-icon="i-lucide-skip-forward"
        class="mt-3"
      >
        Next Episode
      </UButton>
    </div>
  </section>
</template>
