<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatDuration } from '@/utils/anime'
import MetaBadges from './MetaBadges.vue'

withDefaults(defineProps<{
  media: AnimeListItem
  compact?: boolean
}>(), {
  compact: false
})
</script>

<template>
  <article class="anime-card" :class="{ 'anime-card--compact': compact }">
    <NuxtLink :to="detailPath(media)" class="anime-card__poster" :aria-label="media.displayTitle">
      <img :src="media.coverImage" :alt="media.displayTitle" loading="lazy">
      <div class="anime-card__shade" />
      <MetaBadges class="anime-card__badges" :media="media" />
    </NuxtLink>
    <NuxtLink :to="detailPath(media)" class="anime-card__title">
      {{ media.displayTitle }}
    </NuxtLink>
    <p class="anime-card__meta">
      {{ media.badges.format ? media.badges.format.replaceAll('_', ' ') : 'Unknown' }} · {{ formatDuration(media.badges.duration) }}
    </p>
  </article>
</template>

<style scoped>
.anime-card {
  min-width: 0;
}

.anime-card__poster {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 2 / 3;
  border-radius: 5px;
  background: hsl(var(--card));
}

.anime-card__poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 180ms ease;
}

.anime-card__poster:hover img {
  transform: scale(1.04);
}

.anime-card__shade {
  position: absolute;
  inset: auto 0 0;
  height: 42%;
  background: linear-gradient(to top, hsl(var(--background) / 0.94), transparent);
}

.anime-card__badges {
  position: absolute;
  left: 8px;
  bottom: 8px;
}

.anime-card__title {
  display: -webkit-box;
  margin-top: 10px;
  color: hsl(var(--foreground));
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.25;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.anime-card__meta {
  margin-top: 4px;
  color: hsl(var(--muted-foreground));
  font-size: 0.8rem;
}

.anime-card--compact .anime-card__title {
  font-size: 0.82rem;
}

@media (max-width: 520px) {
  .anime-card__badges {
    left: 6px;
    bottom: 6px;
  }

  .anime-card__title {
    margin-top: 8px;
    font-size: 0.84rem;
  }

  .anime-card__meta {
    font-size: 0.72rem;
  }
}
</style>
