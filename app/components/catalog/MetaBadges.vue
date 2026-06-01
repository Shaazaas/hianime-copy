<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { AnimeListItem } from '@/types/anime'
import { formatKind } from '@/utils/anime'

defineProps<{
  media: AnimeListItem
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-1">
    <Badge v-if="media.badges.episodes" class="h-5 rounded-[3px] px-1.5 text-[11px] font-bold">
      EP {{ media.badges.episodes }}
    </Badge>
    <Badge v-if="media.badges.averageScore" variant="secondary" class="h-5 rounded-[3px] px-1.5 text-[11px] font-bold">
      {{ media.badges.averageScore }}
    </Badge>
    <Badge variant="outline" class="h-5 rounded-[3px] px-1.5 text-[11px] font-bold">
      {{ formatKind(media.badges.format) }}
    </Badge>
  </div>
</template>
