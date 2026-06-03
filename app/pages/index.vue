<script setup lang="ts">
import AppFooter from '@/components/catalog/AppFooter.vue'
import SearchSuggest from '@/components/catalog/SearchSuggest.vue'

const topSearches = [
  'My Hero Academia Final Season',
  'Demon Slayer: Kimetsu no Yaiba Infinity Castle',
  'My Gift Lvl 9999 Unlimited Gacha: Backstabbed in a Backwater Dungeon, I\'m Out for Revenge!',
  'One Piece',
  'May I Ask for One Final Thing?',
  'Kaiju No. 8 Season 2',
  'Demon Slayer: Kimetsu no Yaiba',
  'The Fragrant Flower Blooms with Dignity',
  'Chainsaw Man the Movie: Reze Arc',
  'Secrets of the Silent Witch'
]

const nav = [
  { label: 'Home', to: '/home' },
  { label: 'Movies', to: '/filter?format=MOVIE' },
  { label: 'TV Series', to: '/filter?format=TV' },
  { label: 'Most Popular', to: '/filter?sort=popular' },
  { label: 'Top Airing', to: '/filter?status=airing' }
]

useSeoMeta({
  title: 'Watch Anime Online, Free Anime Streaming Online',
  description: 'HiAnime is a free anime discovery website where you can find subbed and dubbed anime with daily updates.'
})
</script>

<template>
  <div class="min-h-[100dvh] overflow-x-clip bg-[#201f31] text-white">
    <ULink raw to="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-30 focus:rounded-md focus:bg-[#ffbade] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#111]">
      Skip to content
    </ULink>

    <header class="mx-auto mt-[60px] w-full max-w-[1200px] px-4 max-[1199px]:mt-2.5">
      <details class="group relative hidden max-[780px]:block">
        <summary class="my-[13px] inline-flex h-11 cursor-pointer list-none items-center gap-2 rounded-[3px] px-3 text-sm font-medium text-white marker:hidden">
          <UIcon name="i-lucide-menu" class="size-4" />
          Menu
        </summary>
        <nav class="absolute left-0 right-0 top-[60px] z-20 rounded-[25px] bg-[#0b0b0b]/95 px-4 py-2 text-center" aria-label="Main navigation">
          <ULink v-for="item in nav" :key="item.label" raw :to="item.to" class="block px-5 py-2.5 text-base font-medium text-white hover:text-[#ffbade]">
            {{ item.label }}
          </ULink>
        </nav>
      </details>

      <nav class="mb-2.5 flex h-[60px] items-center justify-center gap-10 max-[780px]:hidden" aria-label="Main navigation">
        <ULink v-for="item in nav" :key="item.label" raw :to="item.to" class="text-sm font-medium tracking-[1px] text-white hover:text-[#ffbade]">
          {{ item.label }}
        </ULink>
      </nav>
    </header>

    <main id="main-content">
      <section class="relative z-[3] mb-10">
        <div class="mx-auto w-full max-w-[1200px] px-4">
          <div class="relative mx-[-80px] overflow-hidden rounded-[40px] bg-white/[0.05] p-20 max-[1365px]:mx-0 max-[1199px]:p-[60px] max-[520px]:mx-[-15px] max-[520px]:rounded-none max-[520px]:p-[30px]">
            <div class="absolute inset-y-0 right-0 w-[650px] overflow-hidden rounded-r-[40px] max-[780px]:hidden">
              <img
                src="/images/hianime-start-anw.webp"
                alt=""
                width="650"
                height="471"
                fetchpriority="high"
                class="absolute inset-0 h-full w-full object-cover opacity-50"
              >
              <div class="absolute inset-y-0 left-0 z-[3] w-[400px] bg-[linear-gradient(90deg,#2b2a3c_0%,rgba(43,42,60,0)_100%)]" />
            </div>

            <div class="relative z-[4] max-w-[500px]">
              <ULink raw to="/home" class="mb-[30px] inline-block max-[520px]:block max-[520px]:text-center" aria-label="HiAnime home">
                <img src="/images/hianime-archive-logo.png" alt="HiAnime" width="823" height="200" class="h-10 w-auto max-[520px]:mx-auto">
              </ULink>

              <SearchSuggest mode="start" />

              <div class="mt-[30px] text-sm leading-[1.6] text-white max-[520px]:text-xs">
                <span class="mr-2 font-medium text-white">Top search:</span>
                <ULink
                  v-for="(item, index) in topSearches"
                  :key="item"
                  raw
                  :to="`/filter?search=${encodeURIComponent(item)}`"
                  class="mr-1 inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap align-bottom text-white hover:text-[#ffbade]"
                >
                  {{ item }}{{ index === topSearches.length - 1 ? ', ...' : ',' }}
                </ULink>
              </div>

              <div class="mt-10 max-[780px]:mt-[30px]">
                <UButton
                  to="/home"
                  size="xl"
                  trailing-icon="i-lucide-arrow-right-circle"
                  class="h-[60px] w-[260px] justify-center rounded-xl bg-[#ffbade] px-5 text-[22px] font-semibold text-[#111] ring-0 hover:bg-[#ffbade] active:scale-[0.98] max-[520px]:w-full max-[520px]:text-base"
                >
                  Watch anime
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto w-full max-w-[1200px] px-4">
        <div class="mb-[30px]">
          <div class="text-xs">
            <strong class="block text-sm font-semibold text-[#ffbade]">Share HiAnime</strong>
            <p class="mb-0 text-white">to your friends</p>
          </div>
        </div>

        <article class="max-w-[750px] pb-8 text-sm leading-[1.5] text-[#ccc]">
          <h1 class="mb-7 text-[1.8em] font-semibold leading-[1.4] text-white max-[780px]:mb-5 max-[780px]:text-xl">
            HiAnime.to - The best site to watch anime online for Free
          </h1>
          <p class="mb-4">
            Do you know that according to Google, the monthly search volume for anime related topics is up to over 1 Billion times? Anime is famous worldwide and it is no wonder we have seen a sharp rise in the number of free anime streaming sites.
          </p>
          <p class="mb-4">
            Just like free online movie streaming sites, anime watching sites are not created equally. Some are better than the rest, so we have built HiAnime to be one of the best free anime discovery sites for anime fans around the world.
          </p>
          <h2 class="mb-[15px] mt-8 text-[1.5em] font-semibold leading-[1.4] text-white">1/ What is HiAnime.to?</h2>
          <p class="mb-4">
            HiAnime is a free site to explore anime and find subbed or dubbed titles in high quality without registration or payment.
          </p>
          <h2 class="mb-[15px] mt-8 text-[1.5em] font-semibold leading-[1.4] text-white">2/ Is HiAnime.to safe?</h2>
          <p class="mb-4">
            This project links to AniList metadata only. No media files are stored or streamed by this app.
          </p>
          <h2 class="mb-[15px] mt-8 text-[1.5em] font-semibold leading-[1.4] text-white">3/ What makes HiAnime easy to use?</h2>
          <p class="mb-4">
            You can search for a title directly, browse popular anime, filter by format, or open the home catalog for daily discovery.
          </p>
        </article>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
