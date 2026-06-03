<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { formatKind } from '@/utils/anime'

defineProps<{
  media: AnimeListItem
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-0.5">
    <UBadge size="sm" color="primary" variant="solid" class="rounded-sm bg-[#ffbade] px-1.5 font-semibold text-[#111] ring-0">
      HD
    </UBadge>
    <UBadge v-if="media.badges.episodes" size="sm" color="success" variant="solid" class="rounded-sm bg-[#b0e3af] px-1.5 font-semibold text-[#111] ring-0">
      <UIcon name="i-lucide-captions" class="mr-1 size-3.5" />
      {{ media.badges.episodes }}
    </UBadge>
    <UBadge v-if="media.badges.averageScore" size="sm" color="info" variant="solid" class="rounded-sm bg-[#b9e7ff] px-1.5 font-semibold text-[#111] ring-0">
      <UIcon name="i-lucide-mic" class="mr-1 size-3.5" />
      {{ media.badges.averageScore }}
    </UBadge>
    <UBadge size="sm" color="neutral" variant="soft" class="rounded-sm bg-white/25 px-1.5 font-semibold text-white ring-0">
      {{ formatKind(media.badges.format) }}
    </UBadge>
  </div>
</template>
