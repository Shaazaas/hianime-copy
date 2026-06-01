<script setup lang="ts">
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatKind } from '@/utils/anime'
import MetaBadges from './MetaBadges.vue'
import SectionHeader from './SectionHeader.vue'

defineProps<{
  title: string
  items: AnimeListItem[]
}>()
</script>

<template>
  <section>
    <SectionHeader :title="title" to="/filter" />
    <div class="list-lane">
      <NuxtLink
        v-for="item in items.slice(0, 5)"
        :key="item.id"
        :to="detailPath(item)"
        class="list-lane__item"
      >
        <img :src="item.coverImage" :alt="item.displayTitle" loading="lazy">
        <span class="list-lane__copy">
          <strong>{{ item.displayTitle }}</strong>
          <small>{{ formatKind(item.badges.format) }}</small>
          <MetaBadges :media="item" />
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.list-lane {
  display: grid;
  gap: 12px;
}

.list-lane__item {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
  align-items: center;
}

.list-lane__item img {
  width: 52px;
  height: 68px;
  border-radius: 4px;
  object-fit: cover;
}

.list-lane__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-lane__copy strong {
  color: hsl(var(--foreground));
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.18;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-lane__copy small {
  color: hsl(var(--muted-foreground));
  font-size: 0.68rem;
  font-weight: 700;
}

@media (max-width: 1000px) {
  .list-lane {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .list-lane {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .list-lane__item {
    grid-template-columns: 46px minmax(0, 1fr);
  }

  .list-lane__item img {
    width: 46px;
    height: 62px;
  }
}
</style>
