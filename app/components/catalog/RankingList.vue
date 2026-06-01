<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath } from '@/utils/anime'
import MetaBadges from './MetaBadges.vue'

defineProps<{
  title: string
  items: AnimeListItem[]
}>()
</script>

<template>
  <aside class="ranking-list">
    <div class="ranking-list__head">
      <h2>{{ title }}</h2>
      <div class="ranking-list__tabs">
        <span>Today</span>
        <span>Week</span>
        <span>Month</span>
      </div>
    </div>

    <NuxtLink
      v-for="(item, index) in items"
      :key="item.id"
      :to="detailPath(item)"
      class="ranking-list__item"
    >
      <span class="ranking-list__rank">{{ String(index + 1).padStart(2, '0') }}</span>
      <img :src="item.coverImage" :alt="item.displayTitle" loading="lazy">
      <span class="ranking-list__copy">
        <strong>{{ item.displayTitle }}</strong>
        <MetaBadges :media="item" />
      </span>
    </NuxtLink>
  </aside>
</template>

<style scoped>
.ranking-list {
  padding: 18px;
  background: hsl(var(--card));
}

.ranking-list__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.ranking-list__head h2 {
  color: hsl(var(--primary));
  font-size: 1.45rem;
  font-weight: 800;
}

.ranking-list__tabs {
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  background: hsl(var(--secondary));
  color: hsl(var(--muted-foreground));
  font-size: 0.72rem;
  font-weight: 700;
}

.ranking-list__tabs span {
  padding: 7px 10px;
}

.ranking-list__tabs span:first-child {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.ranking-list__item {
  display: grid;
  grid-template-columns: 36px 58px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid hsl(var(--border));
}

.ranking-list__rank {
  color: hsl(var(--muted-foreground));
  font-size: 1.35rem;
  font-weight: 800;
}

.ranking-list__item img {
  width: 58px;
  height: 76px;
  border-radius: 4px;
  object-fit: cover;
}

.ranking-list__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ranking-list__copy strong {
  color: hsl(var(--foreground));
  font-size: 0.86rem;
  line-height: 1.25;
}

@media (max-width: 520px) {
  .ranking-list {
    padding: 14px;
  }

  .ranking-list__head {
    align-items: flex-start;
    gap: 10px;
    flex-direction: column;
  }

  .ranking-list__head h2 {
    font-size: 1.25rem;
  }

  .ranking-list__tabs {
    width: 100%;
  }

  .ranking-list__tabs span {
    flex: 1;
    text-align: center;
  }

  .ranking-list__item {
    grid-template-columns: 28px 48px minmax(0, 1fr);
    gap: 10px;
    padding: 10px 0;
  }

  .ranking-list__rank {
    font-size: 1rem;
  }

  .ranking-list__item img {
    width: 48px;
    height: 64px;
  }

  .ranking-list__copy strong {
    font-size: 0.8rem;
  }
}
</style>
