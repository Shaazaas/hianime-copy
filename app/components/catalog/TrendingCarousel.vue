<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath } from '@/utils/anime'

defineProps<{
  items: AnimeListItem[]
}>()

const list = ref<HTMLElement | null>(null)
let autoplay: ReturnType<typeof window.setInterval> | null = null

function slideStep(element: HTMLElement) {
  const firstSlide = element.querySelector<HTMLElement>('[data-trending-slide]')
  const gap = Number.parseFloat(window.getComputedStyle(element).columnGap || '0')

  return firstSlide ? firstSlide.offsetWidth + gap : Math.round(element.clientWidth * 0.75)
}

function scrollTrending(direction: 1 | -1) {
  const element = list.value
  if (!element) return

  const distance = slideStep(element)
  const nextLeft = element.scrollLeft + (distance * direction)
  const maxLeft = element.scrollWidth - element.clientWidth

  element.scrollTo({
    left: direction > 0 && nextLeft >= maxLeft ? 0 : Math.max(0, nextLeft),
    behavior: 'smooth'
  })
}

function startAutoplay() {
  if (autoplay) return
  autoplay = window.setInterval(() => scrollTrending(1), 2000)
}

function stopAutoplay() {
  if (autoplay) window.clearInterval(autoplay)
  autoplay = null
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <div v-if="items.length" id="anime-trending" class="pb-12">
    <section class="block_area block_area_trending mb-0">
      <div class="mb-6 flex w-full items-center justify-between">
        <div class="bah-heading">
          <h2 class="cat-heading m-0 text-[22px] font-semibold leading-[1.3] text-[#ffbade]">Trending</h2>
        </div>
      </div>

      <div class="block_area-content">
        <div id="trending-home" class="trending-list relative pr-[60px]">
          <div
            ref="list"
            class="flex snap-x gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[479px]:gap-0.5 min-[480px]:max-[899px]:gap-[15px]"
            aria-label="Trending anime"
            @mouseenter="stopAutoplay"
            @mouseleave="startAutoplay"
          >
            <article
              v-for="(item, index) in items.slice(0, 10)"
              :key="item.id"
              data-trending-slide
              class="swiper-slide item-qtip w-[calc((100%-100px)/6)] min-w-[calc((100%-100px)/6)] snap-start max-[1319px]:w-[calc((100%-60px)/4)] max-[1319px]:min-w-[calc((100%-60px)/4)] max-[899px]:w-[calc((100%-30px)/3)] max-[899px]:min-w-[calc((100%-30px)/3)] max-[479px]:w-[calc((100%-4px)/3)] max-[479px]:min-w-[calc((100%-4px)/3)] min-[1880px]:w-[calc((100%-140px)/8)] min-[1880px]:min-w-[calc((100%-140px)/8)]"
            >
              <div class="item relative inline-block w-full overflow-hidden pb-[115%]">
                <div class="number absolute inset-y-0 left-0 w-10 cursor-default overflow-hidden text-center font-semibold">
                  <span class="absolute inset-x-0 bottom-0 z-[9] text-center text-xl leading-none text-[#ffbade]">{{ String(index + 1).padStart(2, '0') }}</span>
                  <div class="film-title dynamic-name absolute bottom-[90px] left-[-55px] h-10 w-[150px] rotate-[-90deg] overflow-hidden text-ellipsis whitespace-nowrap text-left text-[15px] font-medium leading-10 text-white">
                    {{ item.displayTitle }}
                  </div>
                </div>

                <ULink raw :to="detailPath(item)" class="film-poster absolute inset-y-0 left-10 right-0 block overflow-hidden bg-white/10" :aria-label="item.displayTitle">
                  <img :src="item.coverImage" :alt="item.displayTitle" class="film-poster-img absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy">
                </ULink>
              </div>
            </article>
          </div>

          <div class="trending-navi absolute bottom-0 right-0 top-0 w-10">
            <button type="button" class="navi-next absolute inset-x-0 top-0 h-[48%] rounded-[10px] bg-white/10 text-white outline-none hover:bg-[#ffbade] hover:text-[#111]" aria-label="Next trending anime" @click="scrollTrending(1)">
              <UIcon name="i-lucide-chevron-right" class="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2" />
            </button>
            <button type="button" class="navi-prev absolute inset-x-0 bottom-0 h-[48%] rounded-[10px] bg-white/10 text-white outline-none hover:bg-[#ffbade] hover:text-[#111]" aria-label="Previous trending anime" @click="scrollTrending(-1)">
              <UIcon name="i-lucide-chevron-left" class="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
