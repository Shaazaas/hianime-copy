<script setup lang="ts">
import { ArrowRight, PlayCircle, Star } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { AnimeListItem } from '@/types/anime'
import { detailPath, formatDuration, formatKind, watchPath } from '@/utils/anime'

const props = defineProps<{
  items: AnimeListItem[]
}>()

const hero = computed(() => props.items[0])
const heroArt = computed(() => props.items.slice(0, 8).filter(item => item.bannerImage || item.coverImage))
const shortDescription = computed(() => hero.value?.description?.replace(/<[^>]*>/g, '').slice(0, 220))
</script>

<template>
  <section v-if="hero" class="home-hero">
    <div class="home-hero__backdrop">
      <img
        v-for="item in heroArt"
        :key="item.id"
        :src="item.bannerImage || item.coverImage"
        :alt="item.displayTitle"
      >
    </div>

    <div class="home-hero__copy">
      <span class="home-hero__eyebrow">
        <ClientOnly><Star /></ClientOnly>
        #1 Spotlight
      </span>
      <h1>{{ hero.displayTitle }}</h1>
      <div class="home-hero__meta">
        <span>{{ formatKind(hero.badges.format) }}</span>
        <span>{{ formatDuration(hero.badges.duration) }}</span>
        <span v-if="hero.seasonYear">{{ hero.seasonYear }}</span>
        <span v-if="hero.badges.averageScore">{{ hero.badges.averageScore }}%</span>
      </div>
      <p>{{ shortDescription }}</p>
      <div class="home-hero__actions">
        <Button as-child size="sm">
          <NuxtLink :to="watchPath(hero)">
            <ClientOnly><PlayCircle data-icon="inline-start" /></ClientOnly>
            Watch Now
          </NuxtLink>
        </Button>
        <Button as-child variant="secondary" size="sm">
          <NuxtLink :to="detailPath(hero)">
            Detail
            <ClientOnly><ArrowRight data-icon="inline-end" /></ClientOnly>
          </NuxtLink>
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  overflow: hidden;
  min-height: 430px;
  margin-top: -28px;
  background: hsl(var(--background));
}

.home-hero__copy {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 430px;
  width: min(560px, 58vw);
  gap: 12px;
  padding: 72px 58px 52px;
}

.home-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: hsl(var(--foreground));
  font-size: 0.78rem;
  font-weight: 800;
}

.home-hero__eyebrow svg {
  color: hsl(var(--primary));
}

.home-hero__copy h1 {
  color: hsl(var(--foreground));
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  line-height: 1;
}

.home-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: hsl(var(--foreground) / 0.86);
  font-size: 0.76rem;
  font-weight: 800;
}

.home-hero__meta span + span::before {
  content: "•";
  margin-right: 10px;
  color: hsl(var(--muted-foreground));
}

.home-hero__copy p {
  max-width: 620px;
  color: hsl(var(--foreground) / 0.82);
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.55;
}

.home-hero__actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.home-hero__backdrop {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  opacity: 0.42;
}

.home-hero__backdrop::before,
.home-hero__backdrop::after {
  position: absolute;
  inset: 0;
  content: "";
  z-index: 1;
}

.home-hero__backdrop::before {
  background:
    linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.88) 34%, hsl(var(--background) / 0.18) 72%, hsl(var(--background) / 0.74) 100%),
    linear-gradient(180deg, hsl(var(--background) / 0.22) 0%, hsl(var(--background)) 100%);
}

.home-hero__backdrop::after {
  background: linear-gradient(180deg, transparent 0%, hsl(var(--background)) 100%);
  z-index: 1;
}

.home-hero__backdrop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 860px) {
  .home-hero {
    min-height: 380px;
  }

  .home-hero__copy {
    min-height: 380px;
    width: 100%;
    padding: 52px 20px 40px;
  }

  .home-hero__backdrop {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 520px) {
  .home-hero {
    min-height: 350px;
  }

  .home-hero__copy {
    min-height: 350px;
    gap: 10px;
    padding: 34px 14px 28px;
  }

  .home-hero__copy h1 {
    max-width: 12ch;
    font-size: clamp(2.2rem, 14vw, 3.15rem);
  }

  .home-hero__copy p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    font-size: 0.82rem;
  }

  .home-hero__actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 380px) {
  .home-hero__meta {
    gap: 6px;
  }

  .home-hero__meta span + span::before {
    margin-right: 6px;
  }
}
</style>
