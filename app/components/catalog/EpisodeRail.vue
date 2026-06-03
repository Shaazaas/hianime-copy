<script setup lang="ts">
import type { AnimeDetail } from '@/types/anime'

const props = defineProps<{
  media: AnimeDetail
  selected: number
}>()

const episodeCount = computed(() => props.media.badges.episodes || 12)
const episodes = computed(() => Array.from({ length: Math.min(episodeCount.value, 30) }, (_, index) => index + 1))
const search = ref('')
const view = ref<'list' | 'grid'>('list')
const shieldSpoilers = ref(false)

const filteredEpisodes = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return episodes.value

  return episodes.value.filter((episode) => {
    return String(episode).includes(term) || `episode ${episode}`.includes(term)
  })
})

function airedLabel(episode: number) {
  if (!props.media.startDate) return 'Aired date unknown'

  return episode === 1 ? `Aired: ${props.media.startDate}` : `Episode ${episode}`
}
</script>

<template>
  <aside class="catalog-surface min-h-0 rounded-md p-4">
    <div class="flex items-center gap-3">
      <h1 class="text-lg font-semibold text-white">Episodes</h1>
      <UBadge color="neutral" variant="soft" class="rounded-md">{{ episodeCount }}</UBadge>
      <div class="ml-auto flex items-center gap-2">
        <UButton
          size="xs"
          square
          color="neutral"
          variant="ghost"
          :icon="view === 'list' ? 'i-lucide-grid-2x2' : 'i-lucide-rows-3'"
          aria-label="Toggle episode view"
          @click="view = view === 'list' ? 'grid' : 'list'"
        />
        <UButton
          size="xs"
          square
          :color="shieldSpoilers ? 'primary' : 'neutral'"
          :variant="shieldSpoilers ? 'soft' : 'ghost'"
          icon="i-lucide-eye-off"
          aria-label="Toggle spoiler shield"
          @click="shieldSpoilers = !shieldSpoilers"
        />
      </div>
    </div>

    <div class="relative mt-3">
      <UInput
        v-model="search"
        size="sm"
        icon="i-lucide-search"
        placeholder="Search episodes"
        aria-label="Search episodes"
        class="w-full"
      />
      <UButton
        v-if="search"
        size="xs"
        square
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        aria-label="Clear search"
        class="absolute right-1 top-1/2 -translate-y-1/2"
        @click="search = ''"
      />
    </div>

    <div
      class="mt-4 max-h-[680px] overflow-y-auto pr-1 transition-all duration-300 max-[1060px]:max-h-[420px]"
      :class="view === 'grid' ? 'grid grid-cols-5 content-start gap-1.5 p-0.5 pt-1 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10' : 'flex flex-col gap-1.5'"
    >
      <ULink
        v-for="episode in filteredEpisodes"
        :key="episode"
        raw
        :to="`/watch/${media.slug}?ep=${episode}`"
        class="group relative overflow-hidden rounded transition duration-200 active:scale-[0.99]"
        :class="view === 'grid'
          ? [
              'flex h-9 w-full items-center justify-center text-[11px] font-bold tracking-wide',
              episode === selected ? 'bg-[var(--ui-color-primary-500)] text-black' : 'bg-[var(--catalog-panel-soft)] text-default hover:bg-white/10 hover:text-white'
            ]
          : [
              'flex h-20 w-full shrink-0 flex-row items-center border',
              episode === selected ? 'pointer-events-none border-[var(--ui-color-primary-500)] bg-white/5' : 'border-white/5 bg-transparent hover:bg-white/5'
            ]"
      >
        <template v-if="view === 'grid'">
          {{ episode }}
        </template>

        <template v-else>
          <img
            class="h-[82px] w-[48%] shrink-0 object-cover opacity-80 transition duration-300 group-hover:scale-105"
            :class="{ 'blur-md': shieldSpoilers }"
            :src="media.coverImage"
            :alt="`Episode ${episode}`"
            loading="lazy"
          >
          <span class="absolute inset-y-0 left-0 w-[48%] bg-black/20" />
          <div class="min-w-0 flex-1 px-3">
            <p class="truncate text-sm font-semibold text-white">
              {{ episode }}. Episode {{ episode }}
            </p>
            <p class="mt-1 truncate text-xs text-muted">
              {{ shieldSpoilers ? 'Spoiler shield enabled' : airedLabel(episode) }}
            </p>
          </div>
        </template>
      </ULink>

      <div v-if="!filteredEpisodes.length" class="rounded-md border border-[var(--catalog-divider)] bg-white/[0.04] p-5 text-center text-sm text-muted">
        No episodes match your search.
      </div>
    </div>
  </aside>
</template>
