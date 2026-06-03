<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatDuration, formatKind, stripHtml, watchPath } from '@/utils/anime'

const props = defineProps<{
  items: AnimeListItem[]
}>()

const activeIndex = ref(0)
const hero = computed(() => props.items[activeIndex.value])
const shortDescription = computed(() => stripHtml(hero.value?.description).slice(0, 260))
const viewTransitionSource = useId()
const { markAnimeViewTransition, sourceViewTransitionStyle } = useAnimeViewTransition()
const heroViewTransitionSource = computed(() => hero.value ? `${viewTransitionSource}-${hero.value.id}` : viewTransitionSource)

watch(() => props.items.length, (length) => {
  activeIndex.value = length ? Math.min(activeIndex.value, length - 1) : 0
})

function showNextSpotlight() {
  if (!props.items.length) return
  activeIndex.value = (activeIndex.value + 1) % props.items.length
}

function showPreviousSpotlight() {
  if (!props.items.length) return
  activeIndex.value = (activeIndex.value - 1 + props.items.length) % props.items.length
}
</script>

<template>
  <section v-if="hero" class="relative min-h-[520px] overflow-hidden bg-[#201f31] max-[760px]:min-h-[330px]">
    <div class="absolute inset-0">
      <img
        class="ml-auto h-full w-[82vw] object-cover opacity-75 max-[760px]:w-full max-[760px]:opacity-58"
        :style="sourceViewTransitionStyle('cover', hero.id, heroViewTransitionSource)"
        :src="hero.bannerImage || hero.coverImage"
        :alt="hero.displayTitle"
        fetchpriority="high"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,#201f31_0%,rgba(32,31,49,.98)_20%,rgba(32,31,49,.78)_42%,rgba(32,31,49,.42)_62%,rgba(32,31,49,.7)_100%)] max-[760px]:bg-[linear-gradient(180deg,rgba(32,31,49,.2)_0%,rgba(32,31,49,.86)_72%,#201f31_100%)]" />
      <div class="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(32,31,49,0)_0%,#201f31_100%)]" />
    </div>

    <div class="relative z-10 mx-auto flex min-h-[520px] w-full max-w-[1800px] flex-col justify-center px-[15px] pb-14 pt-10 max-[760px]:min-h-[330px] max-[760px]:justify-end max-[760px]:px-4 max-[760px]:pb-8 max-[760px]:pt-16">
      <span class="mb-5 text-xl font-semibold leading-none text-[#ffbade] max-[760px]:mb-2 max-[760px]:text-xs">
        #{{ activeIndex + 1 }} Spotlight
      </span>

      <h1 class="mb-5 max-w-[760px] text-[clamp(2.65rem,4.2vw,4.7rem)] font-semibold leading-[1.16] text-white max-[760px]:mb-2 max-[760px]:max-w-[320px] max-[760px]:text-[20px]" :style="sourceViewTransitionStyle('title', hero.id, heroViewTransitionSource)">
        {{ hero.displayTitle }}
      </h1>

      <div class="mb-5 flex flex-wrap items-center gap-3 text-base font-normal text-white max-[760px]:hidden" :style="sourceViewTransitionStyle('meta', hero.id, heroViewTransitionSource)">
        <span class="inline-flex items-center gap-1"><UIcon name="i-lucide-play-circle" />{{ formatKind(hero.badges.format) }}</span>
        <span class="inline-flex items-center gap-1"><UIcon name="i-lucide-clock" />{{ formatDuration(hero.badges.duration) }}</span>
        <span v-if="hero.seasonYear" class="inline-flex items-center gap-1"><UIcon name="i-lucide-calendar" />{{ hero.seasonYear }}</span>
        <span v-if="hero.badges.averageScore" class="rounded bg-[#ffbade] px-1.5 text-sm font-semibold text-[#111]">Score {{ hero.badges.averageScore }}</span>
        <span v-if="hero.badges.episodes" class="rounded bg-[#b0e3af] px-1.5 text-sm font-semibold text-[#111]">{{ hero.badges.episodes }} eps</span>
      </div>

      <p class="mb-8 line-clamp-3 max-w-[820px] text-base font-normal leading-[1.5] text-white max-[760px]:hidden">
        {{ shortDescription }}
      </p>

      <div class="flex flex-wrap gap-3">
        <UButton :to="watchPath(hero)" size="lg" icon="i-lucide-play-circle" class="h-11 rounded-full bg-[#ffbade] px-6 text-base font-medium text-[#111] ring-0 hover:bg-[#ffbade] max-[760px]:h-9 max-[760px]:px-5 max-[760px]:text-sm">
          Watch Now
        </UButton>
        <UButton :to="detailPath(hero)" color="neutral" variant="soft" size="lg" trailing-icon="i-lucide-chevron-right" class="h-11 rounded-full bg-[#4c4b67] px-6 text-base font-medium text-white ring-0 hover:bg-[#565573] max-[760px]:h-9 max-[760px]:px-5 max-[760px]:text-sm" @pointerdown="markAnimeViewTransition(hero, heroViewTransitionSource)" @click="markAnimeViewTransition(hero, heroViewTransitionSource)">
          Detail
        </UButton>
      </div>
    </div>

    <div class="absolute bottom-[88px] right-4 z-10 grid gap-2 max-[760px]:hidden">
      <UButton color="neutral" variant="soft" icon="i-lucide-chevron-right" size="xl" aria-label="Next spotlight" class="size-12 rounded-md bg-white/10 text-white ring-0 hover:bg-white/15" @click="showNextSpotlight" />
      <UButton color="neutral" variant="soft" icon="i-lucide-chevron-left" size="xl" aria-label="Previous spotlight" class="size-12 rounded-md bg-white/10 text-white ring-0 hover:bg-white/15" @click="showPreviousSpotlight" />
    </div>
  </section>
</template>
