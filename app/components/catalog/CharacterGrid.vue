<script setup lang="ts">
import type { AnimeCharacter } from '@/types/anime'
import SectionHeader from './SectionHeader.vue'

defineProps<{
  characters: AnimeCharacter[]
}>()
</script>

<template>
  <section v-if="characters.length">
    <SectionHeader title="Characters & Voice Actors" />
    <div class="grid grid-cols-2 gap-3 max-[980px]:grid-cols-1">
      <article v-for="character in characters" :key="character.id" class="grid min-h-18 grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)_44px] items-center gap-2.5 bg-white/[0.04] p-2.5">
        <UAvatar :src="character.image || undefined" :alt="character.name" size="md" class="rounded-none" />
        <span class="min-w-0">
          <strong class="block truncate text-xs font-semibold text-white">{{ character.name }}</strong>
          <small class="block truncate text-white/50">{{ character.role || 'Supporting' }}</small>
        </span>
        <span v-if="character.voiceActor" class="min-w-0 text-right">
          <strong class="block truncate text-xs font-semibold text-white">{{ character.voiceActor.name }}</strong>
          <small class="block truncate text-white/50">{{ character.voiceActor.language || 'Japanese' }}</small>
        </span>
        <span v-else />
        <UAvatar v-if="character.voiceActor" :src="character.voiceActor.image || undefined" :alt="character.voiceActor.name" size="md" class="rounded-none" />
      </article>
    </div>
  </section>
</template>
