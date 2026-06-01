<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { AnimeCharacter } from '@/types/anime'
import SectionHeader from './SectionHeader.vue'

defineProps<{
  characters: AnimeCharacter[]
}>()
</script>

<template>
  <section v-if="characters.length">
    <SectionHeader title="Characters & Voice Actors" />
    <div class="character-grid">
      <article v-for="character in characters" :key="character.id" class="character-grid__item">
        <Avatar>
          <AvatarImage v-if="character.image" :src="character.image" :alt="character.name" />
          <AvatarFallback>{{ character.name.slice(0, 2) }}</AvatarFallback>
        </Avatar>
        <span>
          <strong>{{ character.name }}</strong>
          <small>{{ character.role || 'Supporting' }}</small>
        </span>
        <span v-if="character.voiceActor" class="character-grid__actor">
          <strong>{{ character.voiceActor.name }}</strong>
          <small>{{ character.voiceActor.language || 'Japanese' }}</small>
        </span>
        <Avatar v-if="character.voiceActor">
          <AvatarImage v-if="character.voiceActor.image" :src="character.voiceActor.image" :alt="character.voiceActor.name" />
          <AvatarFallback>{{ character.voiceActor.name.slice(0, 2) }}</AvatarFallback>
        </Avatar>
      </article>
    </div>
  </section>
</template>

<style scoped>
.character-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.character-grid__item {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) minmax(0, 1fr) 44px;
  gap: 10px;
  align-items: center;
  min-height: 72px;
  padding: 10px;
  border-radius: 7px;
  background: hsl(var(--card));
}

.character-grid__item strong,
.character-grid__item small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-grid__item strong {
  color: hsl(var(--foreground));
  font-size: 0.78rem;
}

.character-grid__item small {
  color: hsl(var(--muted-foreground));
}

.character-grid__actor {
  text-align: right;
}

@media (max-width: 980px) {
  .character-grid {
    grid-template-columns: 1fr;
  }
}
</style>
