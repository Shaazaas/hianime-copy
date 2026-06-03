<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatDuration } from '@/utils/anime'

const query = shallowRef('')
const open = shallowRef(false)
const debounced = refDebounced(query, 220)
const results = shallowRef<AnimeListItem[]>([])
const loading = shallowRef(false)
const viewTransitionSource = useId()
const { markAnimeViewTransition, sourceViewTransitionStyle } = useAnimeViewTransition()
const props = withDefaults(defineProps<{ mode?: 'default' | 'header' | 'start' }>(), {
  mode: 'default'
})

const isHeaderMode = computed(() => props.mode === 'header')
const isStartMode = computed(() => props.mode === 'start')
const formClass = computed(() => [
  'relative items-center',
  isHeaderMode.value
    ? 'hidden w-[min(35vw,520px)] grid-cols-[minmax(230px,1fr)_44px_62px] lg:grid'
    : isStartMode.value
      ? 'block w-full pr-[60px]'
    : 'grid grid-cols-[minmax(180px,330px)_38px_52px] max-[720px]:w-full max-[720px]:grid-cols-[minmax(0,1fr)_38px_52px] max-[460px]:flex'
])
const inputBaseClass = computed(() => isHeaderMode.value
  ? 'h-[46px] rounded-none border-0 bg-white pl-5 text-[15px] font-semibold text-slate-700 placeholder:text-slate-500 focus-visible:ring-0'
  : isStartMode.value
    ? 'h-[50px] rounded-xl border-0 bg-white px-5 pr-5 text-base font-normal text-slate-700 placeholder:text-slate-500 focus-visible:ring-0'
  : 'h-9 rounded-r-none bg-[var(--catalog-bg-deep)] text-default')
const searchButtonClass = computed(() => isHeaderMode.value
  ? 'h-[46px] rounded-none bg-white text-slate-950 ring-0 hover:bg-white'
  : isStartMode.value
    ? 'absolute right-0 top-0 h-[50px] w-[50px] rounded-xl bg-[#ffbade] text-[#111] ring-0 hover:bg-[#ffbade]'
  : 'h-9 rounded-none')
const filterButtonClass = computed(() => isHeaderMode.value
  ? 'h-[46px] rounded-[7px] bg-black px-3 text-[14px] font-extrabold text-white ring-0 hover:bg-black'
  : 'h-9 rounded-l-none text-xs font-extrabold max-[460px]:hidden')

const viewTransitionKey = (item: AnimeListItem, index: number) => `${viewTransitionSource}-${item.id}-${index}`

const visibleResults = computed(() => (query.value.trim() ? results.value || [] : []))

watch(debounced, async (term, _previous, onCleanup) => {
  const search = term.trim()
  const controller = new AbortController()
  onCleanup(() => controller.abort())

  if (!search) {
    results.value = []
    return
  }

  loading.value = true
  try {
    results.value = await $fetch<AnimeListItem[]>('/api/anilist/search', {
      query: { q: search },
      signal: controller.signal
    })
  } finally {
    loading.value = false
  }
})

function close() {
  open.value = false
}

function submit() {
  const term = query.value.trim()
  if (!term) return
  navigateTo(`/filter?search=${encodeURIComponent(term)}`)
  close()
}
</script>

<template>
  <form :class="formClass" role="search" @submit.prevent="submit">
    <UInput
      v-model="query"
      placeholder="Search anime..."
      name="keyword"
      autocomplete="off"
      aria-label="Search anime"
      class="min-w-0"
      color="neutral"
      variant="outline"
      :ui="{ root: isStartMode ? 'w-full' : undefined, base: inputBaseClass }"
      @focus="open = true"
      @update:model-value="open = true"
    />
    <UButton type="submit" color="neutral" variant="ghost" icon="i-lucide-search" :class="searchButtonClass" aria-label="Search" />
    <UButton v-if="!isStartMode" to="/filter" size="sm" color="neutral" variant="soft" :class="filterButtonClass">
      Filter
    </UButton>

    <UCard
      v-show="open && (visibleResults.length || loading)"
      variant="subtle"
      class="absolute left-0 top-[calc(100%_+_8px)] z-40 w-[min(430px,90vw)] overflow-hidden"
      :ui="{ body: 'p-0 sm:p-0' }"
    >
      <div v-if="loading" class="p-5 font-bold text-muted" aria-live="polite">Searching...</div>
      <UPageList v-else divide>
        <ULink
          v-for="(item, index) in visibleResults"
          :key="item.id"
          raw
          :to="detailPath(item)"
          class="grid min-h-28 grid-cols-[72px_1fr] gap-3.5 p-3"
          @pointerdown="markAnimeViewTransition(item, viewTransitionKey(item, index))"
          @click="markAnimeViewTransition(item, viewTransitionKey(item, index)); close()"
        >
          <img class="h-24 w-[72px] object-cover" :style="sourceViewTransitionStyle('cover', item.id, viewTransitionKey(item, index))" :src="item.coverImage" :alt="item.displayTitle" loading="lazy">
          <span class="flex min-w-0 flex-col justify-center">
            <strong class="text-lg leading-tight text-default" :style="sourceViewTransitionStyle('title', item.id, viewTransitionKey(item, index))">{{ item.displayTitle }}</strong>
            <em class="not-italic text-muted">{{ item.badges.status ? item.badges.status.replaceAll('_', ' ') : 'Unknown' }}</em>
            <small class="text-muted" :style="sourceViewTransitionStyle('meta', item.id, viewTransitionKey(item, index))">/ {{ item.badges.format || 'Unknown' }} / {{ formatDuration(item.badges.duration) }}</small>
          </span>
        </ULink>
      </UPageList>
    </UCard>
  </form>
</template>
