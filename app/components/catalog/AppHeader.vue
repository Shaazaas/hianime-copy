<script setup lang="ts">
import BrandLogo from './BrandLogo.vue'
import SearchSuggest from './SearchSuggest.vue'
import { catalogGenres } from '@/utils/catalogFilters'

const nav = [
  { label: 'Home', to: '/home' },
  { label: 'Subbed Anime', to: '/filter?sort=popular' },
  { label: 'Dubbed Anime', to: '/filter?sort=popular' },
  { label: 'Most Popular', to: '/most-popular' },
  { label: 'Movies', to: '/filter?format=MOVIE' },
  { label: 'TV Series', to: '/filter?format=TV' },
  { label: 'OVAs', to: '/filter?format=OVA' },
  { label: 'ONAs', to: '/filter?format=ONA' },
  { label: 'Specials', to: '/filter?format=SPECIAL' },
  { label: 'Events', to: '/filter?status=airing' },
  { label: 'HiAnime App', to: '/home' }
]

const sidebarSettings = [
  { label: 'W.2.G', icon: 'i-lucide-users', to: '/filter?sort=trending' },
  { label: 'Random', icon: 'i-lucide-shuffle', to: '/filter?sort=popular' },
  { label: 'Name', text: 'EN', to: '/filter' },
  { label: 'News', icon: 'i-lucide-rss', to: '/filter?status=airing' }
]

const headerSettings = [
  { label: 'Watch2gether', icon: 'i-lucide-users', to: '/filter?sort=trending' },
  { label: 'Random', icon: 'i-lucide-shuffle', to: '/filter?sort=popular' },
  { label: 'Anime Name', text: 'EN', to: '/filter' },
  { label: 'News', icon: 'i-lucide-rss', to: '/filter?status=airing' },
  { label: 'Community', icon: 'i-lucide-message-circle', to: '/filter' }
]

const sidebarGenres = catalogGenres.filter(genre => genre !== 'All')

const socialLinks = [
  { label: 'Discord', icon: 'i-lucide-message-circle', class: 'bg-[#6f85d5]' },
  { label: 'Telegram', icon: 'i-lucide-send', class: 'bg-[#08c]' },
  { label: 'Reddit', icon: 'i-lucide-badge-alert', class: 'bg-[#ff3c1f]' },
  { label: 'Twitter', icon: 'i-lucide-twitter', class: 'bg-[#1d9bf0]' }
]

const route = useRoute()
const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
watch(() => route.fullPath, closeMenu)
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-[102] h-[70px] bg-[#201f31] p-0 text-white backdrop-blur-[10px] max-[1299px]:relative max-[1299px]:mb-[25px] max-[1299px]:bg-[#2d2b44] max-[760px]:h-[50px] max-[575px]:mb-[15px]">
    <div class="container relative mx-auto flex h-full w-full max-w-[1800px] items-center pl-[15px] max-[760px]:px-0">
      <button
        type="button"
        aria-label="Open navigation"
        :aria-expanded="menuOpen"
        aria-controls="catalog-navigation-drawer"
        class="absolute left-1.5 top-[15px] z-[4] flex size-10 items-center justify-center rounded-[3px] bg-transparent p-0 text-center text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary max-[760px]:top-[5px]"
        @click="toggleMenu"
      >
          <UIcon name="i-lucide-menu" class="size-6" />
      </button>
      <div class="ml-[50px] mr-[25px] h-10 max-[1599px]:mr-5 max-[760px]:ml-12 max-[760px]:mr-0 max-[760px]:h-9">
        <BrandLogo />
      </div>

      <SearchSuggest mode="header" />

      <div class="ml-[30px] mr-[15px] flex h-10 items-center gap-0 max-[1599px]:ml-[30px] max-[1320px]:hidden">
        <span class="mr-1 flex w-[38px] flex-col justify-center text-center text-sm font-normal leading-none text-white/50">Join now</span>
        <button
          v-for="item in socialLinks"
          :key="item.label"
          type="button"
          :aria-label="item.label"
          class="mr-[5px] inline-flex size-8 items-center justify-center rounded-full text-white"
          :class="item.class"
        >
          <UIcon :name="item.icon" class="size-4" />
        </button>
      </div>

      <nav class="ml-5 flex h-[70px] items-center gap-4 py-[15px] text-center max-[1599px]:ml-[30px] max-[1040px]:hidden" aria-label="Header settings">
        <ULink v-for="item in headerSettings" :key="item.label" raw :to="item.to" class="flex h-10 min-w-[50px] flex-col items-center justify-center gap-1 text-xs font-normal leading-[1.2] text-white hover:text-[#ffbade]">
          <UIcon v-if="item.icon" :name="item.icon" class="h-5 w-full text-[#ffbade]" />
          <span v-else class="block h-[18px] overflow-hidden rounded-[3px] bg-[#4d5059] text-xs font-medium leading-[18px]"><span class="inline-block w-[26px] bg-[#ffbade] text-center text-[#111]">{{ item.text }}</span></span>
          {{ item.label }}
        </ULink>
      </nav>

      <UButton to="/filter" color="neutral" variant="ghost" icon="i-lucide-search" aria-label="Search" class="ml-auto hidden size-10 rounded-none text-white max-[1299px]:inline-flex" />
    </div>
  </header>

  <Teleport to="body">
    <div v-if="menuOpen" class="fixed inset-0 z-[103] bg-[#201f31]/80 backdrop-blur-[10px]" aria-hidden="true" @click="closeMenu" />
    <aside
      v-if="menuOpen"
      id="catalog-navigation-drawer"
      class="fixed bottom-0 left-0 top-0 z-[1000200] h-dvh w-[260px] max-w-[86vw] overflow-y-auto border-r border-black/10 bg-white/10 py-5 text-white opacity-100 shadow-[20px_0_60px_rgba(0,0,0,.25)] backdrop-blur-[10px] [scrollbar-width:none]"
      role="dialog"
      aria-modal="true"
      aria-label="Catalog navigation"
    >
      <button type="button" class="mx-2.5 mb-4 inline-flex rounded-full bg-[#3a3951] px-4 py-2 text-sm font-normal text-white hover:bg-[#403f59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" @click="closeMenu">
        <UIcon name="i-lucide-chevron-left" class="mr-2 size-4" />
        Close menu
      </button>

      <div class="px-2.5">
        <div class="flex items-center gap-4 py-[15px] text-center">
          <ULink v-for="item in sidebarSettings" :key="item.label" raw :to="item.to" class="flex h-10 min-w-[42px] flex-1 flex-col items-center justify-center gap-1 text-xs font-normal leading-[1.2] hover:text-[#ffbade]" @click="closeMenu">
            <UIcon v-if="item.icon" :name="item.icon" class="h-5 w-full text-[#ffbade]" />
            <span v-else class="block h-[18px] overflow-hidden rounded-[3px] bg-[#4d5059] text-xs font-medium leading-[18px]"><span class="inline-block w-[26px] bg-[#ffbade] text-center text-[#111]">{{ item.text }}</span></span>
            {{ item.label }}
          </ULink>
        </div>
      </div>

      <div class="mx-2.5 my-2">
        <UButton to="/filter" color="neutral" variant="soft" icon="i-lucide-message-circle" class="w-full justify-center rounded-full bg-[#4e4e6d] text-[13px] font-medium text-white hover:bg-[#4e4e6d] hover:text-[#ffbade]" @click="closeMenu">
          Community
        </UButton>
      </div>

      <nav class="mt-2.5 text-sm" aria-label="Mobile navigation">
        <ULink v-for="item in nav" :key="item.label" raw :to="item.to" class="block border-b border-white/[.05] px-[15px] py-[15px] font-semibold hover:text-[#ffbade]" @click="closeMenu">
          {{ item.label }}
        </ULink>
      </nav>

      <div>
        <strong class="block border-b border-white/[.05] px-[15px] py-[15px] text-sm font-semibold text-white">Genre</strong>
        <div class="grid grid-cols-2 gap-x-0 gap-y-0 pb-5 text-xs">
          <ULink v-for="genre in sidebarGenres" :key="genre" raw :to="`/filter?genre=${encodeURIComponent(genre)}`" class="truncate px-[15px] py-1.5 text-white/70 hover:text-[#ffbade]" @click="closeMenu">
            {{ genre }}
          </ULink>
        </div>
      </div>
    </aside>
  </Teleport>
</template>
