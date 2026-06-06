<script setup lang="ts">
import type { AnimeDetail } from '@/types/anime'

const props = defineProps<{
  media: AnimeDetail
  selected: number
}>()

const episodeCount = computed(() => props.media.badges.episodes)
const episodes = computed(() => episodeCount.value ? Array.from({ length: Math.min(episodeCount.value, 30) }, (_, index) => index + 1) : [])
const search = ref('')
const view = ref<'list' | 'grid'>('list')
const shieldSpoilers = ref(false)
const viewLabel = computed(() => view.value === 'list' ? 'Switch to grid episode view' : 'Switch to list episode view')

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
  <aside class="min-h-0 bg-[#191826] text-white">
    <div class="flex h-[50px] items-center gap-3 border-b border-white/[0.04] px-[15px]">
      <h2 class="text-[13px] font-semibold text-white">List of episodes</h2>
      <span class="rounded bg-white/10 px-2 py-0.5 text-xs text-white/65">{{ episodeCount || 'Unknown' }}</span>
      <div class="ml-auto flex items-center gap-2">
        <UButton
          size="xs"
          square
          color="neutral"
          variant="ghost"
          :icon="view === 'list' ? 'i-lucide-grid-2x2' : 'i-lucide-rows-3'"
          :aria-label="viewLabel"
          :title="viewLabel"
          :aria-pressed="view === 'grid'"
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

    <div v-if="episodes.length" class="relative px-[15px] py-2.5">
      <UInput
        v-model="search"
        size="sm"
        icon="i-lucide-search"
        placeholder="Number of Ep"
        aria-label="Search episodes"
        class="w-full"
        :ui="{ base: 'h-[30px] rounded-none border-0 bg-[#201f31] text-xs text-white placeholder:text-white/40 ring-0' }"
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
      v-if="episodes.length"
      class="catalog-scrollbar max-h-[590px] overflow-y-auto pb-[15px] transition-all duration-300 max-[1199px]:max-h-[467px]"
      :class="view === 'grid' ? 'grid grid-cols-5 content-start px-2.5 text-center' : 'flex flex-col'"
    >
      <ULink
        v-for="episode in filteredEpisodes"
        :key="episode"
        raw
        :to="`/watch/${media.slug}?ep=${episode}`"
        class="group relative overflow-hidden transition duration-200 active:scale-[0.99]"
        :class="view === 'grid'
          ? [
              'm-0.5 flex h-[32px] w-full items-center justify-center rounded-[3px] text-[13px] font-semibold',
              episode === selected ? 'bg-[#ffbade] text-[#111]' : 'bg-[#35373d] text-[#999] hover:bg-[#67686f] hover:text-white'
            ]
          : [
              'flex min-h-[42px] w-full shrink-0 flex-row items-center',
              episode === selected ? 'pointer-events-none bg-[#2b2a42] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#ffbade]' : 'odd:bg-white/[0.03] hover:bg-[#2b2a42]'
            ]"
      >
        <template v-if="view === 'grid'">
          {{ episode }}
        </template>

        <template v-else>
          <span class="absolute left-2.5 top-1/2 w-5 -translate-y-1/2 text-center text-sm font-semibold" :class="episode === selected ? 'text-[#ffbade]' : 'text-[#bbb] group-hover:text-white'">{{ episode }}</span>
          <div class="min-w-0 flex-1 pl-[45px] pr-11">
            <p class="truncate py-3 text-[13px] font-normal leading-[1.4]" :class="episode === selected ? 'text-white' : 'text-[#ccc] group-hover:text-[#ffbade]'">
              Episode {{ episode }}
            </p>
            <p class="-mt-2 mb-2 truncate text-[11px] leading-[1.2] opacity-50">
              {{ shieldSpoilers ? 'Spoiler shield enabled' : airedLabel(episode) }}
            </p>
          </div>
          <span v-if="episode === selected" class="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-[#ffbade] text-[8px] text-[#111]">
            <UIcon name="i-lucide-play" class="ml-px size-2.5" />
          </span>
        </template>
      </ULink>

      <div v-if="!filteredEpisodes.length" class="bg-[#201f31] p-5 text-center text-sm text-white/55">
        No episodes match your search.
      </div>
    </div>
    <div v-else class="p-[15px] text-sm text-white/55">
      AniList does not list an episode count for this title yet.
    </div>
  </aside>
</template>
