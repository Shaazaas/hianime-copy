<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { formatKind } from '@/utils/anime'

defineProps<{
  media: AnimeListItem
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-0.5">
    <UBadge v-if="media.badges.episodes" size="sm" color="success" variant="soft" class="rounded-sm px-1.5 font-semibold">
      <UIcon name="i-lucide-captions" class="mr-1 size-3.5" />
      {{ media.badges.episodes }}
    </UBadge>
    <UBadge v-if="media.badges.averageScore" size="sm" color="info" variant="soft" class="rounded-sm px-1.5 font-semibold">
      <UIcon name="i-lucide-star" class="mr-1 size-3.5" />
      {{ media.badges.averageScore }}
    </UBadge>
    <UBadge size="sm" color="neutral" variant="soft" class="rounded-sm px-1.5 font-semibold">
      {{ formatKind(media.badges.format) }}
    </UBadge>
  </div>
</template>
