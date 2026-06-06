import type { MaybeRefOrGetter } from 'vue'

const captureImage = '/images/capture.png'

export const hianimeGenericSeo = {
  title: 'Watch Anime Online, Free Anime Streaming Online on HiAnime.to Anime Website',
  description: 'HiAnime is a Free anime streaming website which you can watch English Subbed and Dubbed Anime online with No Account and Daily update. WATCH NOW!',
  keywords: 'anime to watch, watch anime,anime online, free anime online, online anime, anime streaming, stream anime online, english anime, english dubbed anime'
}

export const hianimeHomeSeo = {
  title: 'HiAnime Free Anime Streaming Homepage',
  description: 'Watch your favorite anime online in Dub or Sub format without registration on HiAnime.to fastest Streaming server NOW.',
  keywords: 'watch anime online, anime site, free anime, anime to watch, online anime, anime streaming, stream anime online, english anime, english dubbed anime'
}

export const hianimeMostPopularSeo = {
  title: 'Watch Most Popular Anime SUBBED/DUBBED Online',
  description: 'Full list of the Most Popular and Must Watch Anime Online Free, with SUBBED and DUBBED. WATCH NOW!',
  keywords: 'must watch anime, best anime to watch, legendary anime, most popular anime, top anime, anime to watch'
}

export const hianimeTopAiringSeo = {
  title: 'Watch Top Airing Anime SUBBED/DUBBED Online',
  description: 'Follow and Watch The Top Airing Anime Online Free on HiAnime.to, with SUBBED and DUBBED. DOWNLOAD Available!',
  keywords: 'On going anime, current anime, airing anime, anime to watch, today anime, anime schedule, watch anime online, free anime streaming, watch anime free'
}

export function hianimeWatchSeo(title: string) {
  return {
    title: `Watch ${title} English Sub/Dub online Free on HiAnime.to`,
    description: `Best site to watch ${title} English Sub/Dub online Free and download ${title} English Sub/Dub anime.`,
    keywords: `${title} English Sub/Dub, free ${title} online, watch ${title} online, watch ${title} free, download ${title} anime, download ${title} free`
  }
}

export function useHianimeSeo(input: {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  keywords: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string>
}) {
  const route = useRoute()
  const requestUrl = import.meta.server ? useRequestURL() : null
  const origin = computed(() => requestUrl?.origin || globalThis.location?.origin || 'https://hianime.to')
  const currentUrl = computed(() => `${origin.value}${route.fullPath}`)
  const image = computed(() => {
    const value = toValue(input.image) || captureImage

    return value.startsWith('http') ? value : `${origin.value}${value}`
  })

  useSeoMeta({
    title: () => toValue(input.title),
    description: () => toValue(input.description),
    robots: 'index,follow',
    ogType: 'website',
    ogUrl: () => currentUrl.value,
    ogTitle: () => toValue(input.title),
    ogDescription: () => toValue(input.description),
    ogImage: () => image.value
  })

  useHead({
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
      { 'http-equiv': 'content-language', content: 'en' },
      { name: 'keywords', content: () => toValue(input.keywords) },
      { property: 'og:image:width', content: '650' },
      { property: 'og:image:height', content: '350' },
      { name: 'apple-mobile-web-app-status-bar', content: '#202125' },
      { name: 'theme-color', content: '#202125' },
      { name: 'msapplication-TileColor', content: '#da532c' }
    ]
  })
}
