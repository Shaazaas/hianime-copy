<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: 'dark',
    lang: 'en'
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'
    }
  ],
  link: [
    { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'mask-icon', href: '/images/safari-pinned-tab.svg', color: '#ffbade' },
    { rel: 'icon', sizes: '192x192', href: '/images/icons-192.png' },
    { rel: 'icon', sizes: '512x512', href: '/images/icons-512.png' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://hianime.to/',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://hianime.to/search?keyword={keyword}',
          'query-input': 'required name=keyword'
        }
      })
    }
  ]
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
