<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatDuration, formatKind, stripHtml, watchPath } from '@/utils/anime'

const props = defineProps<{
  items: AnimeListItem[]
}>()

const activeIndex = ref(0)
const hero = computed(() => props.items[activeIndex.value])
const viewTransitionSource = useId()
const { markAnimeViewTransition, sourceViewTransitionStyle } = useAnimeViewTransition()
const heroViewTransitionSource = computed(() => hero.value ? `${viewTransitionSource}-${hero.value.id}` : viewTransitionSource)
let spotlightAutoplay: ReturnType<typeof setInterval> | null = null

watch(() => props.items.length, (length) => {
  activeIndex.value = length ? Math.min(activeIndex.value, length - 1) : 0
  restartSpotlightAutoplay()
})

function showNextSpotlight() {
  if (!props.items.length) return
  activeIndex.value = (activeIndex.value + 1) % props.items.length
}

function showPreviousSpotlight() {
  if (!props.items.length) return
  activeIndex.value = (activeIndex.value - 1 + props.items.length) % props.items.length
}

function restartSpotlightAutoplay() {
  if (spotlightAutoplay) clearInterval(spotlightAutoplay)
  spotlightAutoplay = null

  if (props.items.length < 2) return
  spotlightAutoplay = setInterval(showNextSpotlight, 3000)
}

function spotlightDescription(item: AnimeListItem) {
  return stripHtml(item.description).slice(0, 260)
}

function slideStyle(item: AnimeListItem, index: number) {
  const distance = index - activeIndex.value

  return {
    transform: `translate3d(${distance * 100}%, 0, 0)`,
    ...sourceViewTransitionStyle('cover', item.id, heroViewTransitionSource.value)
  }
}

onMounted(() => {
  restartSpotlightAutoplay()
})

onBeforeUnmount(() => {
  if (spotlightAutoplay) clearInterval(spotlightAutoplay)
})
</script>

<template>
  <section v-if="items.length" id="slider" class="deslide relative min-h-[520px] overflow-hidden bg-[#201f31] max-[760px]:min-h-[330px]" aria-roledescription="carousel" aria-label="Spotlight anime">
    <div class="swiper-wrapper absolute inset-0 flex overflow-hidden">
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="swiper-slide deslide-item absolute inset-0 overflow-hidden bg-[#201f31] transition-transform duration-300 ease-[ease]"
        :class="{ 'pointer-events-none': index !== activeIndex }"
        :style="{ transform: `translate3d(${(index - activeIndex) * 100}%, 0, 0)` }"
        :aria-hidden="index !== activeIndex"
        :inert="index !== activeIndex"
      >
        <div class="deslide-cover absolute bottom-0 left-[30%] right-0 top-0 overflow-hidden [mask-image:linear-gradient(270deg,transparent_0,#201f31_30%,#201f31_70%,transparent)] max-[760px]:left-0 max-[760px]:[mask-image:none]">
          <img
            class="film-poster-img absolute inset-0 h-full w-full object-cover opacity-75 max-[760px]:opacity-58"
            :style="index === activeIndex ? slideStyle(item, index) : undefined"
            :src="item.bannerImage || item.coverImage"
            :alt="item.displayTitle"
            :fetchpriority="index === activeIndex ? 'high' : undefined"
            loading="eager"
          >
          <div class="absolute inset-0 z-[2] bg-[linear-gradient(0deg,#201f31_0%,rgba(32,31,49,0)_50%,#201f31_100%)]" />
        </div>
        <div class="absolute inset-0 bg-[linear-gradient(90deg,#201f31_0%,rgba(32,31,49,.98)_20%,rgba(32,31,49,.78)_42%,rgba(32,31,49,.36)_62%,rgba(32,31,49,.7)_100%)] max-[760px]:bg-[linear-gradient(180deg,rgba(32,31,49,.2)_0%,rgba(32,31,49,.86)_72%,#201f31_100%)]" />
        <div class="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(32,31,49,0)_0%,#201f31_100%)]" />

        <div class="deslide-item-content relative z-10 mx-auto flex min-h-[520px] w-full max-w-[1800px] flex-col justify-end px-[15px] pb-10 pt-10 max-[760px]:min-h-[330px] max-[760px]:px-4 max-[760px]:pb-8 max-[760px]:pt-16">
          <span class="desi-sub-text mb-5 text-lg font-normal leading-[1.3] text-[#ffbade] max-[760px]:mb-2 max-[760px]:text-xs">
            #{{ index + 1 }} Spotlight
          </span>

          <h1 class="desi-head-title mb-6 line-clamp-2 max-w-[800px] text-[clamp(2.45rem,3vw,3rem)] font-bold leading-[1.3] text-white max-[760px]:mb-2 max-[760px]:max-w-[320px] max-[760px]:text-[20px]" :style="index === activeIndex ? sourceViewTransitionStyle('title', item.id, heroViewTransitionSource) : undefined">
            {{ item.displayTitle }}
          </h1>

          <div class="sc-detail mb-3 flex flex-wrap items-center gap-x-[15px] gap-y-1 text-base font-light text-white max-[760px]:hidden" :style="index === activeIndex ? sourceViewTransitionStyle('meta', item.id, heroViewTransitionSource) : undefined">
            <span class="inline-flex items-center gap-1"><UIcon name="i-lucide-play-circle" />{{ formatKind(item.badges.format) }}</span>
            <span class="inline-flex items-center gap-1"><UIcon name="i-lucide-clock" />{{ formatDuration(item.badges.duration) }}</span>
            <span v-if="item.seasonYear" class="inline-flex items-center gap-1"><UIcon name="i-lucide-calendar" />{{ item.seasonYear }}</span>
            <span class="rounded-[5px] bg-[#ffbade] px-1 py-[3px] text-xs font-semibold leading-none text-[#111]">HD</span>
            <span v-if="item.badges.episodes" class="rounded bg-[#b0e3af] px-1.5 text-xs font-semibold text-[#111]">{{ item.badges.episodes }}</span>
          </div>

          <p class="desi-description mb-8 line-clamp-3 max-w-[800px] text-[0.95em] font-light leading-[1.6] text-white max-[760px]:hidden">
            {{ spotlightDescription(item) }}
          </p>

          <div class="desi-buttons flex flex-wrap gap-3">
            <UButton :to="watchPath(item)" size="lg" icon="i-lucide-play-circle" class="h-11 rounded-full bg-[#ffbade] px-6 text-base font-medium text-[#111] ring-0 hover:bg-[#ffbade] max-[760px]:h-9 max-[760px]:px-5 max-[760px]:text-sm">
              Watch Now
            </UButton>
            <UButton :to="detailPath(item)" color="neutral" variant="soft" size="lg" trailing-icon="i-lucide-chevron-right" class="h-11 rounded-full bg-[#4c4b67] px-6 text-base font-medium text-white ring-0 hover:bg-[#565573] max-[760px]:h-9 max-[760px]:px-5 max-[760px]:text-sm" @pointerdown="markAnimeViewTransition(item, heroViewTransitionSource)" @click="markAnimeViewTransition(item, heroViewTransitionSource)">
              Detail
            </UButton>
          </div>
        </div>
      </article>
    </div>

    <div class="swiper-navigation absolute bottom-5 right-4 z-10 grid gap-1.5 max-[760px]:hidden">
      <UButton color="neutral" variant="soft" icon="i-lucide-chevron-right" size="xl" aria-label="Next spotlight" class="size-10 rounded-md bg-white/10 text-white ring-0 hover:bg-[#ffbade] hover:text-[#111]" @click="showNextSpotlight" />
      <UButton color="neutral" variant="soft" icon="i-lucide-chevron-left" size="xl" aria-label="Previous spotlight" class="size-10 rounded-md bg-white/10 text-white ring-0 hover:bg-[#ffbade] hover:text-[#111]" @click="showPreviousSpotlight" />
    </div>
  </section>
</template>
