<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatDuration } from '@/utils/anime'
import MetaBadges from './MetaBadges.vue'

withDefaults(defineProps<{
  media: AnimeListItem
  compact?: boolean
}>(), {
  compact: false
})

const viewTransitionSource = useId()
const { markAnimeViewTransition, sourceViewTransitionStyle } = useAnimeViewTransition()
</script>

<template>
  <article class="catalog-motion-card min-w-0">
    <ULink raw :to="detailPath(media)" class="group relative block aspect-[5/7] overflow-hidden bg-white/10" :aria-label="media.displayTitle" @pointerdown="markAnimeViewTransition(media, viewTransitionSource)" @click="markAnimeViewTransition(media, viewTransitionSource)">
      <img class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" :style="sourceViewTransitionStyle('cover', media.id, viewTransitionSource)" :src="media.coverImage" :alt="media.displayTitle" loading="lazy">
      <div class="absolute inset-x-0 bottom-0 h-3/5 bg-[linear-gradient(0deg,#201f31_0%,rgba(32,31,49,0)_58%)]" />
      <div class="absolute inset-0 bg-black/0 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
        <UIcon name="i-lucide-play" class="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-white" />
      </div>
      <MetaBadges class="absolute bottom-2 left-2 max-[520px]:bottom-1.5 max-[520px]:left-1.5" :style="sourceViewTransitionStyle('meta', media.id, viewTransitionSource)" :media="media" />
    </ULink>
    <ULink raw :to="detailPath(media)" class="mt-2 line-clamp-1 block text-base font-medium leading-[1.3] text-white hover:text-[#ffbade] max-[520px]:text-[13px]" :class="{ 'text-sm': compact }" :style="sourceViewTransitionStyle('title', media.id, viewTransitionSource)" @pointerdown="markAnimeViewTransition(media, viewTransitionSource)" @click="markAnimeViewTransition(media, viewTransitionSource)">
      {{ media.displayTitle }}
    </ULink>
    <p class="mt-1 line-clamp-1 text-sm font-normal text-[#aaa] max-[520px]:text-xs">
      {{ media.badges.format ? media.badges.format.replaceAll('_', ' ') : 'Unknown' }} / {{ formatDuration(media.badges.duration) }}
    </p>
  </article>
</template>
