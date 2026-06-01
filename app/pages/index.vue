<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import type { HomeCatalog } from '@/types/anime'
import AnimeCard from '@/components/catalog/AnimeCard.vue'
import AppFooter from '@/components/catalog/AppFooter.vue'
import AppHeader from '@/components/catalog/AppHeader.vue'
import HomeHero from '@/components/catalog/HomeHero.vue'
import ListLane from '@/components/catalog/ListLane.vue'
import RankingList from '@/components/catalog/RankingList.vue'
import SectionHeader from '@/components/catalog/SectionHeader.vue'
import ShareStrip from '@/components/catalog/ShareStrip.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const { data } = await useFetch<HomeCatalog>('/api/anilist/home', {
  default: () => ({
    spotlight: [],
    trending: [],
    topAiring: [],
    popular: [],
    favourites: [],
    completed: [],
    recommended: [],
    top: [],
    schedule: []
  })
})

useSeoMeta({
  title: 'Home'
})

const latestEpisodes = computed(() => data.value.recommended.slice(0, 12))
const newOnHianime = computed(() => [
  ...data.value.trending,
  ...data.value.popular,
  ...data.value.favourites
].slice(0, 12))
const genreList = computed(() => {
  const genres = new Set<string>()
  const sources = [
    ...data.value.trending,
    ...data.value.recommended,
    ...data.value.popular,
    ...data.value.favourites
  ]

  for (const item of sources) {
    for (const genre of item.genres) genres.add(genre)
  }

  return [...genres].slice(0, 24)
})

const scheduleDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <div>
    <AppHeader />
    <main class="home-page">
      <HomeHero :items="data.spotlight" />

      <section class="home-page__trending">
        <SectionHeader title="Trending" to="/filter?sort=trending" />
        <div class="home-page__rail">
          <AnimeCard v-for="item in data.trending.slice(0, 10)" :key="item.id" :media="item" compact />
        </div>
      </section>

      <ShareStrip />

      <div class="home-page__mini">
        <ListLane title="Top Airing" :items="data.topAiring" />
        <ListLane title="Most Popular" :items="data.popular" />
        <ListLane title="Most Favourite" :items="data.favourites" />
        <ListLane title="Latest Completed" :items="data.completed" />
      </div>

      <div class="home-page__columns">
        <div class="home-page__main">
          <section>
            <SectionHeader title="Latest Episodes" to="/filter?status=airing" />
            <div class="home-page__grid">
              <AnimeCard v-for="item in latestEpisodes" :key="item.id" :media="item" />
            </div>
          </section>

          <section>
            <SectionHeader title="New On HiAnime" to="/filter?sort=popular" />
            <div class="home-page__grid">
              <AnimeCard v-for="item in newOnHianime" :key="item.id" :media="item" />
            </div>
          </section>

          <section>
            <SectionHeader title="Estimated Schedule" />
            <div class="home-page__schedule-head">
              <ToggleGroup type="single" default-value="Mon" class="home-page__days">
                <ToggleGroupItem
                  v-for="day in scheduleDays"
                  :key="day"
                  :value="day"
                  size="sm"
                >
                  {{ day }}
                </ToggleGroupItem>
              </ToggleGroup>
              <Button as-child size="sm" variant="secondary">
                <NuxtLink to="/filter?status=airing">
                  Show all
                  <ClientOnly><ChevronRight data-icon="inline-end" /></ClientOnly>
                </NuxtLink>
              </Button>
            </div>
            <div class="home-page__schedule">
              <article v-for="(item, index) in data.schedule.slice(0, 8)" :key="item.id">
                <time>{{ `${20 + index}:00` }}</time>
                <NuxtLink :to="`/anime/${item.slug}`">{{ item.displayTitle }}</NuxtLink>
                <span>Episode {{ item.badges.episodes || '?' }}</span>
              </article>
            </div>
          </section>
        </div>

        <div class="home-page__side">
          <Card class="home-page__genres">
            <CardHeader class="home-page__genres-head">
              <CardTitle class="home-page__genres-title">Genres</CardTitle>
            </CardHeader>
            <CardContent class="home-page__genres-content">
              <NuxtLink v-for="genre in genreList" :key="genre" :to="`/filter?genre=${encodeURIComponent(genre)}`">
                <Badge variant="secondary">{{ genre }}</Badge>
              </NuxtLink>
            </CardContent>
          </Card>
          <RankingList title="Top 10" :items="data.top" />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.home-page {
  width: min(1430px, calc(100% - 44px));
  margin: 28px auto 0;
}

.home-page__trending {
  margin-top: 34px;
}

.home-page__rail {
  display: grid;
  grid-template-columns: repeat(10, minmax(112px, 1fr));
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x proximity;
}

.home-page__rail :deep(.anime-card) {
  min-width: 124px;
  scroll-snap-align: start;
}

.home-page__mini {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px;
  margin-top: 34px;
}

.home-page__columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: 26px;
  margin-top: 36px;
}

.home-page__main {
  display: grid;
  gap: 38px;
}

.home-page__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px;
}

.home-page__side {
  display: grid;
  align-content: start;
  gap: 22px;
}

.home-page__genres {
  border: 0;
  border-radius: 0;
  background: hsl(var(--card));
}

.home-page__genres-head {
  padding-bottom: 10px;
}

.home-page__genres-title {
  color: hsl(var(--primary));
  font-size: 1rem;
}

.home-page__genres-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.home-page__schedule {
  display: grid;
  gap: 2px;
  border-radius: 6px;
  overflow: hidden;
}

.home-page__schedule article {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 14px;
  align-items: center;
  min-height: 42px;
  padding: 0 14px;
  background: hsl(var(--card));
}

.home-page__schedule-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.home-page__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(58px, 1fr));
  gap: 8px;
  width: min(100%, 560px);
}

.home-page__days :deep(button) {
  border-radius: 4px;
  background: hsl(var(--card));
  font-weight: 800;
}

.home-page__schedule time,
.home-page__schedule span {
  color: hsl(var(--muted-foreground));
  font-size: 0.8rem;
  font-weight: 700;
}

.home-page__schedule a {
  min-width: 0;
  color: hsl(var(--foreground));
  font-size: 0.86rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .home-page__columns {
    grid-template-columns: 1fr;
  }

  .home-page__side {
    grid-template-columns: minmax(0, 1fr);
  }

  .home-page__mini {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-page__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .home-page {
    width: min(100% - 32px, 860px);
  }

  .home-page__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .home-page__side {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
}

@media (max-width: 760px) {
  .home-page {
    width: min(100% - 24px, 720px);
    margin-top: 18px;
  }

  .home-page__trending {
    margin-top: 24px;
  }

  .home-page__rail {
    grid-template-columns: repeat(10, minmax(116px, 42vw));
    gap: 12px;
    margin-inline: -12px;
    padding-inline: 12px;
  }

  .home-page__rail :deep(.anime-card) {
    min-width: 116px;
  }

  .home-page__mini {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 24px;
  }

  .home-page__columns {
    gap: 30px;
    margin-top: 30px;
  }

  .home-page__main {
    gap: 32px;
  }

  .home-page__side {
    grid-template-columns: 1fr;
  }

  .home-page__genres {
    order: 2;
  }
}

@media (max-width: 680px) {
  .home-page {
    width: min(100% - 22px, 640px);
  }

  .home-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .home-page__schedule-head {
    align-items: stretch;
    flex-direction: column;
  }

  .home-page__days {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    width: 100%;
  }

  .home-page__schedule article {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 8px;
    min-height: 54px;
    padding: 8px 10px;
  }

  .home-page__schedule span {
    grid-column: 2;
  }
}

@media (max-width: 420px) {
  .home-page {
    width: min(100% - 18px, 420px);
  }

  .home-page__grid {
    gap: 12px;
  }

  .home-page__genres-head,
  .home-page__genres-content {
    padding-inline: 16px;
  }

  .home-page__genres-content {
    gap: 6px;
  }

  .home-page__schedule a {
    white-space: normal;
  }
}
</style>
