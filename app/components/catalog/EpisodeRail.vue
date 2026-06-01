<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { AnimeDetail } from '@/types/anime'

const props = defineProps<{
  media: AnimeDetail
  selected: number
}>()

const episodeCount = computed(() => props.media.badges.episodes || 12)
const episodes = computed(() => Array.from({ length: Math.min(episodeCount.value, 30) }, (_, index) => index + 1))
</script>

<template>
  <aside class="episode-rail">
    <div class="episode-rail__head">
      <strong>List of Episodes:</strong>
      <input aria-label="Number of episode" placeholder="Number of Ep">
    </div>
    <Button
      v-for="episode in episodes"
      :key="episode"
      as-child
      :variant="episode === selected ? 'default' : 'ghost'"
      class="episode-rail__button"
    >
      <NuxtLink :to="`/watch/${media.slug}?ep=${episode}`">
        <span>{{ episode }}</span>
        {{ media.displayTitle }} Episode {{ episode }}
      </NuxtLink>
    </Button>
  </aside>
</template>

<style scoped>
.episode-rail {
  width: 290px;
  max-height: 728px;
  overflow: auto;
  background: hsl(216 38% 10%);
}

.episode-rail__head {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 8px;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid hsl(var(--border));
  font-size: 0.75rem;
}

.episode-rail__head input {
  height: 30px;
  min-width: 0;
  border: 1px solid hsl(var(--border));
  border-radius: 4px;
  background: hsl(var(--background));
  padding: 0 8px;
  color: hsl(var(--foreground));
}

.episode-rail__button {
  width: 100%;
  height: 48px;
  justify-content: start;
  border-radius: 0;
  overflow: hidden;
  font-size: 0.78rem;
}

.episode-rail__button span {
  width: 26px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .episode-rail {
    width: 100%;
    max-height: 260px;
  }
}
</style>
