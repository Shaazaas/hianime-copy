<script setup lang="ts">
import { Search } from '@lucide/vue'
import { refDebounced } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatDuration } from '@/utils/anime'

const query = shallowRef('')
const open = shallowRef(false)
const debounced = refDebounced(query, 220)
const results = shallowRef<AnimeListItem[]>([])
const loading = shallowRef(false)

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
  <form class="search-suggest" role="search" @submit.prevent="submit">
    <Input
      v-model="query"
      placeholder="Search anime..."
      class="search-suggest__input"
      @focus="open = true"
      @input="query = ($event.target as HTMLInputElement).value; open = true"
    />
    <Button type="submit" size="icon" class="search-suggest__button" aria-label="Search">
      <ClientOnly><Search data-icon="inline-start" /></ClientOnly>
    </Button>
    <Button type="button" size="sm" variant="secondary" class="search-suggest__filter" @click="navigateTo('/filter')">
      Filter
    </Button>

    <div v-show="open && (visibleResults.length || loading)" class="search-suggest__panel">
      <div v-if="loading" class="search-suggest__loading">Searching...</div>
      <NuxtLink
        v-for="item in visibleResults"
        :key="item.id"
        :to="detailPath(item)"
        class="search-suggest__item"
        @click="close"
      >
        <img :src="item.coverImage" :alt="item.displayTitle" loading="lazy">
        <span>
          <strong>{{ item.displayTitle }}</strong>
          <em>{{ item.badges.status ? item.badges.status.replaceAll('_', ' ') : 'Unknown' }}</em>
          <small>• {{ item.badges.format || 'Unknown' }} • {{ formatDuration(item.badges.duration) }}</small>
        </span>
      </NuxtLink>
    </div>
  </form>
</template>

<style scoped>
.search-suggest {
  position: relative;
  display: grid;
  grid-template-columns: minmax(180px, 330px) 38px 52px;
  align-items: center;
}

.search-suggest__input {
  height: 38px;
  border-radius: 0;
  background: hsl(0 0% 100%);
  color: hsl(240 6% 10%);
}

.search-suggest__button,
.search-suggest__filter {
  height: 38px;
  border-radius: 0;
}

.search-suggest__filter {
  font-size: 0.78rem;
  font-weight: 800;
}

.search-suggest__panel {
  position: absolute;
  z-index: 40;
  top: calc(100% + 8px);
  left: 0;
  width: min(430px, 90vw);
  overflow: hidden;
  border-radius: 0 0 8px 8px;
  background: hsl(216 38% 10% / 0.97);
  box-shadow: 0 18px 44px hsl(0 0% 0% / 0.35);
}

.search-suggest__item {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  min-height: 112px;
  padding: 10px 16px;
  border-bottom: 1px dashed hsl(var(--border));
}

.search-suggest__loading {
  padding: 18px;
  color: hsl(var(--muted-foreground));
  font-weight: 700;
}

.search-suggest__item img {
  width: 72px;
  height: 94px;
  object-fit: cover;
}

.search-suggest__item span {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.search-suggest__item strong {
  color: hsl(var(--foreground));
  font-size: 1.25rem;
  line-height: 1.25;
}

.search-suggest__item em {
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
}

.search-suggest__item small {
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
}

@media (max-width: 720px) {
  .search-suggest {
    grid-template-columns: minmax(0, 1fr) 38px 52px;
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 460px) {
  .search-suggest {
    display: flex;
    width: 100%;
  }

  .search-suggest__filter {
    display: none;
  }

  .search-suggest__input {
    min-width: 0;
    flex: 1 1 auto;
  }

  .search-suggest__button {
    flex: 0 0 40px;
  }

  .search-suggest__input,
  .search-suggest__button {
    height: 36px;
  }
}
</style>
