<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { AnimeDetail, HomeCatalog } from '@/types/anime'
import { detailPath, idFromSlug } from '@/utils/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import EpisodeRail from '@/components/catalog/EpisodeRail.vue'
import RankingList from '@/components/catalog/RankingList.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'
import ShareStrip from '@/components/catalog/ShareStrip.vue'
import WatchShell from '@/components/catalog/WatchShell.vue'

const route = useRoute()
const id = computed(() => idFromSlug(route.params.slug))
const selected = computed(() => Math.max(1, Number.parseInt(String(route.query.ep || '1'), 10) || 1))

if (!id.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

const { data: media } = await useFetch<AnimeDetail>(() => `/api/anilist/media/${id.value}`)
const { data: home } = await useFetch<HomeCatalog>('/api/anilist/home')

if (!media.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

useSeoMeta({
  title: () => media.value ? `Watch ${media.value.displayTitle} Episode ${selected.value}` : 'Watch'
})
</script>

<template>
  <div v-if="media">
    <AppHeader />
    <main class="watch-page">
      <p class="watch-page__crumb">Home • TV • {{ media.displayTitle }}</p>
      <section class="watch-page__stage">
        <EpisodeRail :media="media" :selected="selected" />
        <WatchShell :media="media" :selected="selected" />
      </section>

      <section class="watch-page__summary">
        <img :src="media.coverImage" :alt="media.displayTitle">
        <div>
          <h1>{{ media.displayTitle }}</h1>
          <p>{{ media.badges.format || 'Unknown' }} • {{ media.badges.duration || 'Unknown' }} min per ep</p>
          <p>{{ media.description }}</p>
          <Button as-child size="sm" variant="secondary">
            <NuxtLink :to="detailPath(media)">View detail</NuxtLink>
          </Button>
        </div>
      </section>
    </main>

    <section class="watch-page__band">
      <ShareStrip />
    </section>

    <main class="watch-page watch-page--lower">
      <div class="watch-page__columns">
        <div>
          <SectionHeader title="Recommended for you" />
          <div class="watch-page__grid">
            <AnimeCard v-for="item in media.recommendations" :key="item.id" :media="item" />
          </div>
        </div>
        <aside class="watch-page__side">
          <div class="reserved-panel">Catalog space reserved</div>
          <RankingList v-if="home" title="AniList Top 10" :items="home.top" />
        </aside>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.watch-page {
  width: min(1220px, calc(100% - 48px));
  margin: 28px auto 0;
}

.watch-page__crumb {
  margin-bottom: 16px;
  color: hsl(var(--foreground));
  font-size: 0.86rem;
  font-weight: 700;
}

.watch-page__stage {
  display: flex;
  align-items: stretch;
}

.watch-page__summary {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
  margin: 54px 0;
  max-width: 900px;
}

.watch-page__summary img {
  width: 120px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.watch-page__summary h1 {
  font-size: 1.35rem;
  font-weight: 800;
}

.watch-page__summary p {
  margin-top: 10px;
  color: hsl(var(--foreground));
  line-height: 1.5;
}

.watch-page__band {
  padding: 28px 0;
  background: hsl(var(--card));
}

.watch-page__band :deep(.share-strip) {
  width: min(1220px, calc(100% - 48px));
  margin: 0 auto;
}

.watch-page__columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: 36px;
}

.watch-page__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.watch-page__side {
  display: grid;
  align-content: start;
  gap: 28px;
}

.reserved-panel {
  display: grid;
  place-items: center;
  min-height: 220px;
  border-radius: 7px;
  background: linear-gradient(180deg, hsl(var(--primary) / 0.24), hsl(var(--primary) / 0.12));
  color: hsl(var(--foreground));
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
}

@media (max-width: 940px) {
  .watch-page__stage {
    flex-direction: column;
  }

  .watch-page__columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .watch-page {
    width: min(100% - 28px, 660px);
  }

  .watch-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
