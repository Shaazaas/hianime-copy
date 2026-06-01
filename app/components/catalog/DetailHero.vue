<script setup lang="ts">
import { Plus, PlayCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { AnimeDetail } from '@/types/anime'
import { formatDateLabel, formatDuration, formatKind, watchPath } from '@/utils/anime'
import MetaBadges from './MetaBadges.vue'

defineProps<{
  media: AnimeDetail
}>()
</script>

<template>
  <section class="detail-hero">
    <img class="detail-hero__poster" :src="media.coverImage" :alt="media.displayTitle">
    <div class="detail-hero__main">
      <p class="detail-hero__crumb">Home • TV • {{ media.displayTitle }}</p>
      <h1>{{ media.displayTitle }}</h1>
      <MetaBadges :media="media" />
      <div class="detail-hero__actions">
        <Button as-child size="lg">
          <NuxtLink :to="watchPath(media)">
            <ClientOnly><PlayCircle data-icon="inline-start" /></ClientOnly>
            Watch Now
          </NuxtLink>
        </Button>
        <Button size="lg" variant="secondary">
          Add to List
          <ClientOnly><Plus data-icon="inline-end" /></ClientOnly>
        </Button>
      </div>
      <p class="detail-hero__description">{{ media.description }}</p>
    </div>
    <aside class="detail-hero__facts">
      <p><strong>Japanese:</strong> {{ media.nativeTitle || 'Unknown' }}</p>
      <p><strong>Ranked:</strong> AniList score {{ media.badges.averageScore || 'Unknown' }}</p>
      <p><strong>Aired:</strong> {{ formatDateLabel(media.startDate) }} to {{ formatDateLabel(media.endDate) }}</p>
      <p><strong>Duration:</strong> {{ formatDuration(media.badges.duration) }}</p>
      <p><strong>Status:</strong> {{ formatKind(media.badges.status) }}</p>
      <p><strong>Genres:</strong> {{ media.genres.join(', ') || 'Unknown' }}</p>
      <p><strong>Studios:</strong> {{ media.studios.join(', ') || 'Unknown' }}</p>
      <p><strong>Producers:</strong> {{ media.producers.join(', ') || 'Unknown' }}</p>
    </aside>
  </section>
</template>

<style scoped>
.detail-hero {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;
  padding: 90px 0 42px;
}

.detail-hero__poster {
  width: 250px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.detail-hero__crumb {
  color: hsl(var(--muted-foreground));
  font-weight: 700;
}

.detail-hero h1 {
  margin-top: 28px;
  color: hsl(var(--foreground));
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.05;
}

.detail-hero__actions {
  display: flex;
  gap: 16px;
  margin: 32px 0;
}

.detail-hero__description {
  max-width: 840px;
  color: hsl(var(--foreground));
  line-height: 1.65;
}

.detail-hero__facts {
  min-height: 520px;
  padding: 170px 20px 24px;
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  font-size: 0.86rem;
  line-height: 1.55;
}

.detail-hero__facts p {
  padding: 8px 0;
  border-bottom: 1px solid hsl(var(--border));
}

@media (max-width: 1050px) {
  .detail-hero {
    grid-template-columns: 170px 1fr;
  }

  .detail-hero__poster {
    width: 170px;
  }

  .detail-hero__facts {
    grid-column: 1 / -1;
    min-height: 0;
    padding: 20px;
  }
}

@media (max-width: 650px) {
  .detail-hero {
    grid-template-columns: 1fr;
    padding-top: 40px;
  }
}
</style>
