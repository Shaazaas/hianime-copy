<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath } from '@/utils/anime'
import MetaBadges from './MetaBadges.vue'

defineProps<{
  title: string
  items: AnimeListItem[]
}>()

const viewTransitionSource = useId()
const { markAnimeViewTransition, sourceViewTransitionStyle } = useAnimeViewTransition()

const viewTransitionKey = (item: AnimeListItem, index: number) => `${viewTransitionSource}-${item.id}-${index}`
</script>

<template>
  <UCard variant="subtle" class="catalog-surface" :ui="{ body: 'p-5 sm:p-6' }">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="text-3xl font-black text-primary max-[520px]:text-2xl">{{ title }}</h2>
      <UBadge color="neutral" variant="soft" class="rounded-md">{{ items.length }}</UBadge>
    </div>

    <UPageList divide>
      <ULink
        v-for="(item, index) in items"
        :key="item.id"
        raw
        :to="detailPath(item)"
        class="catalog-motion-card grid grid-cols-[32px_54px_minmax(0,1fr)] items-center gap-3 py-3.5 max-[520px]:grid-cols-[28px_48px_minmax(0,1fr)] max-[520px]:gap-2.5 max-[520px]:py-3"
        @pointerdown="markAnimeViewTransition(item, viewTransitionKey(item, index))"
        @click="markAnimeViewTransition(item, viewTransitionKey(item, index))"
      >
        <span class="text-xl font-black text-primary max-[520px]:text-base">{{ String(index + 1).padStart(2, '0') }}</span>
        <img class="h-[72px] w-[54px] rounded object-cover max-[520px]:h-16 max-[520px]:w-12" :style="sourceViewTransitionStyle('cover', item.id, viewTransitionKey(item, index))" :src="item.coverImage" :alt="item.displayTitle" loading="lazy">
        <span class="flex min-w-0 flex-col gap-2">
          <strong class="text-sm leading-tight text-default max-[520px]:text-xs" :style="sourceViewTransitionStyle('title', item.id, viewTransitionKey(item, index))">{{ item.displayTitle }}</strong>
          <MetaBadges :style="sourceViewTransitionStyle('meta', item.id, viewTransitionKey(item, index))" :media="item" />
        </span>
      </ULink>
    </UPageList>
  </UCard>
</template>
