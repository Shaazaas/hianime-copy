<script setup lang="ts">
import type { AnimeDetail, HomeCatalog } from '@/types/anime'
import { idFromSlug } from '@/utils/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import CharacterGrid from '@/components/catalog/CharacterGrid.vue'
import DetailHero from '@/components/catalog/DetailHero.vue'
import RankingList from '@/components/catalog/RankingList.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'
import ShareStrip from '@/components/catalog/ShareStrip.vue'

const route = useRoute()
const id = computed(() => idFromSlug(route.params.slug))

if (!id.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

const { data: media } = await useFetch<AnimeDetail>(() => `/api/anilist/media/${id.value}`)
const { data: home } = await useFetch<HomeCatalog>('/api/anilist/home')

if (!media.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' })
}

useSeoMeta({
  title: () => media.value?.displayTitle || 'Anime'
})
</script>

<template>
  <div v-if="media">
    <AppHeader />
    <main class="detail-page">
      <DetailHero :media="media" />
      <ShareStrip class="detail-page__share" />
      <div class="detail-page__columns">
        <div class="detail-page__main">
          <CharacterGrid :characters="media.characters" />
          <section>
            <SectionHeader title="Recommended for you" />
            <div class="detail-page__grid">
              <AnimeCard v-for="item in media.recommendations" :key="item.id" :media="item" />
            </div>
          </section>
        </div>
        <div class="detail-page__side">
          <div class="reserved-panel">Catalog space reserved</div>
          <RankingList v-if="home" title="AniList Top 10" :items="home.top" />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.detail-page {
  width: min(1460px, calc(100% - 48px));
  margin: 0 auto;
}

.detail-page__share {
  margin: 24px 0 46px 250px;
}

.detail-page__columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 36px;
}

.detail-page__main {
  display: grid;
  gap: 54px;
}

.detail-page__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.detail-page__side {
  display: grid;
  align-content: start;
  gap: 28px;
}

.reserved-panel {
  display: grid;
  place-items: center;
  min-height: 270px;
  border-radius: 7px;
  background: linear-gradient(180deg, hsl(var(--primary) / 0.24), hsl(var(--primary) / 0.12));
  color: hsl(var(--foreground));
  font-size: 1.45rem;
  font-weight: 800;
  text-align: center;
}

@media (max-width: 1120px) {
  .detail-page__columns {
    grid-template-columns: 1fr;
  }

  .detail-page__share {
    margin-left: 0;
  }
}

@media (max-width: 700px) {
  .detail-page {
    width: min(100% - 28px, 660px);
  }

  .detail-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
