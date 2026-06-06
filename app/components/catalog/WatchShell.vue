<script setup lang="ts">
import type { AnimeDetail } from '@/types/anime'

const props = defineProps<{
  media: AnimeDetail
  selected: number
  expanded?: boolean
}>()

const emit = defineEmits<{
  'update:expanded': [value: boolean]
}>()

const lightsOff = ref(false)
const scheduleVisible = ref(true)

const nextEpisode = computed(() => {
  const count = props.media.badges.episodes
  if (!count) return null

  return Math.min(props.selected + 1, count)
})

const previousEpisode = computed(() => props.selected > 1 ? props.selected - 1 : null)
const playerClass = computed(() => props.expanded
  ? 'aspect-video h-auto'
  : 'h-[570px] max-[1599px]:h-[460px] max-[1400px]:aspect-video max-[1400px]:h-auto')
</script>

<template>
  <Teleport to="body">
    <button
      v-if="lightsOff"
      type="button"
      class="fixed inset-0 z-[103] cursor-default bg-black/80"
      aria-label="Turn lights back on"
      @click="lightsOff = false"
    />
  </Teleport>

  <section class="relative min-w-0" :class="{ 'z-[104]': lightsOff }">
    <div class="overflow-hidden bg-black">
      <div class="relative grid place-content-center overflow-hidden bg-black text-center text-white" :class="playerClass">
        <img
          v-if="media.bannerImage"
          class="absolute inset-0 h-full w-full object-cover opacity-30 blur-[2px]"
          :src="media.bannerImage"
          :alt="media.displayTitle"
        >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.72)_66%),linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.92))]" />
        <div class="relative mx-auto grid max-w-[420px] gap-3 px-5">
          <span class="mx-auto grid size-[74px] place-items-center rounded-full bg-white/10 text-primary ring-1 ring-white/15">
            <UIcon name="i-lucide-play" class="ml-1 size-9" />
          </span>
          <p class="text-2xl font-semibold leading-tight text-white max-[520px]:text-xl">Episode {{ selected }}</p>
          <span class="text-sm leading-relaxed text-white/60">Catalog preview mode. Streaming is not connected in this AniList-backed copy.</span>
        </div>
      </div>
    </div>

    <div class="flex min-h-10 flex-wrap items-center bg-[#11101a] p-[5px] text-[13px] text-white">
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] max-[520px]:px-0"
        :aria-pressed="expanded"
        :aria-label="expanded ? 'Collapse player' : 'Expand player'"
        @click="emit('update:expanded', !expanded)"
      >
        <UIcon :name="expanded ? 'i-lucide-minimize' : 'i-lucide-maximize'" class="size-4 text-[#ffbade]" />
        <span class="max-[520px]:hidden">{{ expanded ? 'Collapse' : 'Expand' }}</span>
      </button>
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center gap-2 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] max-[520px]:px-0"
        :aria-pressed="lightsOff"
        aria-label="Toggle light"
        @click="lightsOff = !lightsOff"
      >
        <UIcon name="i-lucide-lightbulb" class="size-4 text-[#ffbade]" />
        <span class="max-[520px]:hidden">Light</span>
      </button>
      <button type="button" class="m-[5px] inline-flex h-[30px] items-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] max-[760px]:hidden">
        Auto Play
        <span class="ml-0.5 font-medium text-[#ff3f29]">Off</span>
      </button>
      <button type="button" class="m-[5px] inline-flex h-[30px] items-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] max-[860px]:hidden">
        Auto Next
        <span class="ml-0.5 font-medium text-[#ff3f29]">Off</span>
      </button>
      <button type="button" class="m-[5px] inline-flex h-[30px] items-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] max-[980px]:hidden">
        Auto Skip Intro
        <span class="ml-0.5 font-medium text-[#ff3f29]">Off</span>
      </button>
      <div class="ml-auto flex items-center">
        <UButton
          v-if="previousEpisode"
          :to="`/watch/${media.slug}?ep=${previousEpisode}`"
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-chevron-left"
          class="m-[5px] h-[30px] rounded-[3px] px-1 text-[13px] text-white hover:bg-transparent hover:text-[#ffbade]"
        >
          Prev
        </UButton>
        <UButton
          v-if="nextEpisode && nextEpisode !== selected"
          :to="`/watch/${media.slug}?ep=${nextEpisode}`"
          size="sm"
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-chevron-right"
          class="m-[5px] h-[30px] rounded-[3px] px-1 text-[13px] text-white hover:bg-transparent hover:text-[#ffbade]"
        >
          Next
        </UButton>
        <UButton to="/filter?sort=trending" color="neutral" variant="ghost" icon="i-lucide-users" class="m-[5px] h-[30px] rounded-[3px] px-1 text-[13px] text-white hover:bg-transparent hover:text-[#ffbade]">
          <span class="max-[1199px]:hidden">Watch2gether</span><span class="hidden max-[1199px]:inline">Live</span>
        </UButton>
      </div>
    </div>

    <div class="grid min-h-[100px] grid-cols-[230px_minmax(0,1fr)] bg-[#11101a] px-[15px] pb-[15px] max-[640px]:grid-cols-1">
      <div class="relative grid place-items-center rounded-l-md bg-[#ffbade] px-[15px] text-center text-[13px] font-medium leading-[1.3] text-[#111] max-[640px]:min-h-[74px] max-[640px]:rounded-t-md max-[640px]:rounded-bl-none">
        <span><strong class="mb-1 block font-medium">You are watching</strong>Episode {{ selected }}</span>
      </div>
      <div class="grid min-h-[100px] place-items-center rounded-r-md bg-[#201f31] px-[15px] text-center text-[13px] text-white/55 max-[640px]:rounded-b-md max-[640px]:rounded-tr-none">
        Streaming servers are not connected in this AniList catalog copy.
      </div>
    </div>

    <div v-if="scheduleVisible" class="bg-[#11101a] px-[15px] pb-[15px]">
      <div class="rounded-md bg-[#08c] px-[15px] py-3 text-left text-xs font-medium leading-[1.5] text-white">
        <button type="button" class="float-right -mt-1 text-xl leading-none text-white/80" aria-label="Dismiss schedule alert" @click="scheduleVisible = false">×</button>
        <UIcon name="i-lucide-rocket" class="mr-1 inline-block size-4 align-[-3px]" />
        Estimated the next episode will come at the listed catalog schedule.
      </div>
    </div>

  </section>
</template>
