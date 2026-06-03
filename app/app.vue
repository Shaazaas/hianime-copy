<script setup lang="ts">
const siteDescription = 'HiAnime is an AniList-backed anime catalog inspired by compact anime discovery layouts.'
const logoImage = '/images/hianime-archive-logo.png'

useHead({
  titleTemplate: (title) => title ? `${title} - HiAnime` : 'HiAnime',
  htmlAttrs: {
    class: 'dark',
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/png', href: logoImage },
    { rel: 'apple-touch-icon', href: logoImage }
  ],
  meta: [
    {
      name: 'description',
      content: siteDescription
    },
    {
      name: 'theme-color',
      content: '#201f31'
    }
  ]
})

useServerSeoMeta({
  description: siteDescription,
  ogTitle: 'HiAnime',
  ogDescription: siteDescription,
  ogImage: logoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: 'HiAnime',
  twitterDescription: siteDescription,
  twitterImage: logoImage
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
