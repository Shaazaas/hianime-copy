<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath } from '@/utils/anime'
import MetaBadges from './MetaBadges.vue'
import SectionHeader from './SectionHeader.vue'

defineProps<{
  title: string
  items: AnimeListItem[]
}>()

const viewTransitionSource = useId()
const { markAnimeViewTransition, sourceViewTransitionStyle } = useAnimeViewTransition()

const viewTransitionKey = (item: AnimeListItem, index: number) => `${viewTransitionSource}-${item.id}-${index}`
</script>

<template>
  <section class="min-w-0">
    <SectionHeader :title="title" to="/filter" />
    <UPageList class="gap-0" divide>
      <ULink
        v-for="(item, index) in items.slice(0, 5)"
        :key="item.id"
        raw
        :to="detailPath(item)"
        class="catalog-motion-card grid min-h-[108px] min-w-0 grid-cols-[72px_minmax(0,1fr)] items-center gap-4 py-4 max-[620px]:min-h-[96px] max-[620px]:grid-cols-[60px_minmax(0,1fr)] max-[620px]:gap-3 max-[620px]:py-3"
        @pointerdown="markAnimeViewTransition(item, viewTransitionKey(item, index))"
        @click="markAnimeViewTransition(item, viewTransitionKey(item, index))"
      >
        <img class="h-[94px] w-[70px] rounded object-cover max-[620px]:h-[82px] max-[620px]:w-[58px]" :style="sourceViewTransitionStyle('cover', item.id, viewTransitionKey(item, index))" :src="item.coverImage" :alt="item.displayTitle" loading="lazy">
        <span class="flex min-w-0 flex-col gap-3">
          <strong class="line-clamp-2 text-base font-bold leading-tight text-highlighted" :style="sourceViewTransitionStyle('title', item.id, viewTransitionKey(item, index))">{{ item.displayTitle }}</strong>
          <MetaBadges :style="sourceViewTransitionStyle('meta', item.id, viewTransitionKey(item, index))" :media="item" />
        </span>
      </ULink>
    </UPageList>
    <UButton to="/filter" color="neutral" variant="link" size="xl" trailing-icon="i-lucide-chevron-right" class="mt-4 px-0 text-xl font-semibold">
      View more
    </UButton>
  </section>
</template>
