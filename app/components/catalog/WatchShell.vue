<script setup lang="ts">
import { Captions, Expand, ListVideo, Settings, SkipForward, Volume2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { AnimeDetail } from '@/types/anime'

defineProps<{
  media: AnimeDetail
  selected: number
}>()
</script>

<template>
  <section class="watch-shell">
    <div class="watch-shell__player">
      <div class="watch-shell__screen">
        <p>Playback placeholder</p>
        <span>No anime playback API is connected yet.</span>
      </div>
      <div class="watch-shell__controls">
        <span>▶</span>
        <ClientOnly><Volume2 /></ClientOnly>
        <b>00:00 / {{ media.badges.duration || 24 }}:00</b>
        <i />
        <ClientOnly><ListVideo /></ClientOnly>
        <ClientOnly><Captions /></ClientOnly>
        <ClientOnly><Settings /></ClientOnly>
        <ClientOnly><Expand /></ClientOnly>
      </div>
      <div class="watch-shell__below">
        <div class="watch-shell__now">
          <strong>Now Watching:</strong>
          <span>{{ media.displayTitle }} Episode {{ selected }}</span>
          <small>If playback is added later, server selection belongs here.</small>
        </div>
        <div class="watch-shell__dub">
          <span>SUB <b>Sub {{ selected }}</b></span>
          <span>DUB <b>Unavailable</b></span>
        </div>
        <Button as-child>
          <NuxtLink :to="`/watch/${media.slug}?ep=${selected + 1}`">
            Next Episode
            <ClientOnly><SkipForward data-icon="inline-end" /></ClientOnly>
          </NuxtLink>
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.watch-shell {
  min-width: 0;
  flex: 1;
}

.watch-shell__player {
  background: hsl(216 38% 10%);
}

.watch-shell__screen {
  display: grid;
  place-content: center;
  aspect-ratio: 16 / 9;
  background:
    linear-gradient(hsl(206 74% 86% / 0.8), hsl(0 0% 96% / 0.86)),
    hsl(var(--card));
  color: hsl(220 10% 22%);
  text-align: center;
}

.watch-shell__screen p {
  display: inline;
  margin: 0 auto 8px;
  padding: 4px 8px;
  background: hsl(0 0% 0% / 0.45);
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
}

.watch-shell__screen span {
  display: block;
  padding: 4px 8px;
  background: hsl(0 0% 0% / 0.38);
  color: white;
}

.watch-shell__controls {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 54px;
  padding: 0 18px;
  border-top: 4px solid hsl(var(--primary));
  background: black;
  color: white;
}

.watch-shell__controls svg {
  width: 20px;
}

.watch-shell__controls i {
  flex: 1;
}

.watch-shell__below {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 20px;
}

.watch-shell__now {
  max-width: 250px;
  padding: 12px;
  border-radius: 4px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  text-align: center;
}

.watch-shell__now strong,
.watch-shell__now span,
.watch-shell__now small {
  display: block;
}

.watch-shell__now small {
  margin-top: 8px;
  font-size: 0.7rem;
}

.watch-shell__dub {
  display: grid;
  gap: 10px;
  margin-right: auto;
}

.watch-shell__dub span {
  display: flex;
  align-items: center;
  gap: 14px;
  color: hsl(var(--foreground));
  font-weight: 800;
}

.watch-shell__dub b {
  padding: 7px 14px;
  border-radius: 4px;
  background: hsl(var(--secondary));
  font-size: 0.75rem;
}

@media (max-width: 700px) {
  .watch-shell__below {
    align-items: stretch;
    flex-direction: column;
  }

  .watch-shell__now {
    max-width: none;
  }
}
</style>
