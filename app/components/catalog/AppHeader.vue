<script setup lang="ts">
import BrandLogo from './BrandLogo.vue'
import SearchSuggest from './SearchSuggest.vue'

const nav = [
  { label: 'Home', to: '/home' },
  { label: 'TV Anime', to: '/filter?format=TV' },
  { label: 'Popular Anime', to: '/filter?sort=popular' },
  { label: 'Most Popular', to: '/filter?sort=popular' },
  { label: 'Movies', to: '/filter?format=MOVIE' },
  { label: 'TV Series', to: '/filter?format=TV' },
  { label: 'OVAs', to: '/filter?format=OVA' },
  { label: 'ONAs', to: '/filter?format=ONA' },
  { label: 'Specials', to: '/filter?format=SPECIAL' }
]

const quickLinks = [
  { label: 'Spotlight', icon: 'i-lucide-radio-tower', to: '/filter?sort=trending' },
  { label: 'Random', icon: 'i-lucide-shuffle', to: '/filter?sort=popular' },
  { label: 'Anime Name', icon: 'i-lucide-languages', to: '/filter' },
  { label: 'Airing', icon: 'i-lucide-rss', to: '/filter?status=airing' },
  { label: 'Genres', icon: 'i-lucide-tags', to: '/filter?format=TV' }
]

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
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
watch(() => route.fullPath, closeMenu)
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-[102] h-[70px] bg-[#201f31]/95 text-white backdrop-blur-[10px] max-[760px]:h-[50px]">
    <div class="relative mx-auto flex h-full w-full max-w-[1800px] items-center px-[15px] max-[760px]:px-0">
      <button
        type="button"
        aria-label="Open navigation"
        :aria-expanded="menuOpen"
        aria-controls="catalog-navigation-drawer"
        class="absolute left-1.5 top-[15px] z-[4] flex size-10 items-center justify-center rounded-[3px] text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary max-[760px]:top-[5px]"
        @click="toggleMenu"
      >
          <UIcon name="i-lucide-menu" class="size-7" />
      </button>

      <div v-if="menuOpen" class="fixed inset-0 z-[101] bg-black/45" aria-hidden="true" @click="closeMenu" />
      <aside
        id="catalog-navigation-drawer"
        class="fixed bottom-0 left-0 top-0 z-[102] w-[320px] max-w-[86vw] overflow-y-auto bg-[#2d2b44] px-5 py-5 text-white shadow-[20px_0_60px_rgba(0,0,0,.35)] transition-transform duration-300"
        :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
        role="dialog"
        aria-modal="true"
        aria-label="Catalog navigation"
      >
          <div class="mb-5 flex justify-end">
            <button type="button" class="inline-flex rounded-full bg-[#3a3951] px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" @click="closeMenu">
              Close menu
            </button>
          </div>
          <div class="mb-5 grid grid-cols-4 gap-2">
            <ULink v-for="item in quickLinks.slice(0, 4)" :key="item.label" raw :to="item.to" class="rounded-xl bg-white/10 p-3 text-center text-xs font-medium hover:text-[#ffbade]">
              <UIcon :name="item.icon" class="mx-auto mb-1 size-5 text-[#ffbade]" />
              {{ item.label }}
            </ULink>
          </div>
          <nav aria-label="Mobile navigation">
            <ULink v-for="item in nav" :key="item.label" raw :to="item.to" class="block border-b border-white/10 py-3 text-sm font-medium hover:text-[#ffbade]">
              {{ item.label }}
            </ULink>
          </nav>
      </aside>

      <div class="ml-[50px] mr-[25px] h-10 max-[760px]:ml-12 max-[760px]:mr-0 max-[760px]:h-9">
        <BrandLogo />
      </div>

      <SearchSuggest mode="header" />

      <div class="ml-[30px] flex h-10 items-center gap-1.5 max-[1320px]:hidden">
        <span class="mr-1 flex w-[38px] flex-col justify-center text-center text-sm font-normal leading-none text-white/50">Join now</span>
        <button
          v-for="item in socialLinks"
          :key="item.label"
          type="button"
          :aria-label="item.label"
          class="inline-flex size-8 items-center justify-center rounded-full text-white"
          :class="item.class"
        >
          <UIcon :name="item.icon" class="size-4" />
        </button>
      </div>

      <nav class="ml-auto flex h-full items-center gap-6 pr-4 max-[1040px]:hidden" aria-label="Quick links">
        <ULink v-for="item in quickLinks" :key="item.label" raw :to="item.to" class="flex h-full min-w-[76px] flex-col items-center justify-center text-center text-[13px] font-medium leading-tight text-white hover:text-[#ffbade]">
          <UIcon :name="item.icon" class="mb-1 size-5 text-[#ffbade]" />
          {{ item.label }}
        </ULink>
      </nav>

      <UButton to="/filter" color="neutral" variant="ghost" icon="i-lucide-search" aria-label="Search" class="ml-auto hidden size-10 rounded-none text-white max-[760px]:inline-flex" />
    </div>
  </header>
</template>
