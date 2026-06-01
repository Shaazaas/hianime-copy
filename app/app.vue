<script setup lang="ts">
useHead({
  titleTemplate: (title) => title ? `${title} - HiAnime` : 'HiAnime',
  htmlAttrs: {
    class: 'dark',
    lang: 'en'
  },
  meta: [
    {
      name: 'description',
      content: 'AniList-backed anime catalog inspired by compact anime discovery layouts.'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
