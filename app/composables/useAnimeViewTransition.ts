import type { AnimeListItem } from '@/types/anime'

type AnimeViewTransitionPart = 'cover' | 'title' | 'meta'

const animeViewTransitionNames: Record<AnimeViewTransitionPart, string> = {
  cover: 'anime-cover',
  title: 'anime-title',
  meta: 'anime-meta'
}

export function useAnimeViewTransition() {
  const activeAnimeId = useState<number | null>('active-anime-view-transition-id', () => null)
  const activeSourceKey = useState<string | null>('active-anime-view-transition-source', () => null)

  function markAnimeViewTransition(media: Pick<AnimeListItem, 'id'>, sourceKey: string) {
    activeAnimeId.value = media.id
    activeSourceKey.value = sourceKey
  }

  function clearAnimeViewTransition() {
    activeAnimeId.value = null
    activeSourceKey.value = null
  }

  function sourceViewTransitionStyle(part: AnimeViewTransitionPart, id: number, sourceKey: string) {
    return {
      viewTransitionName: activeAnimeId.value === id && activeSourceKey.value === sourceKey ? animeViewTransitionNames[part] : 'none'
    }
  }

  function destinationViewTransitionStyle(part: AnimeViewTransitionPart, id: number) {
    return {
      viewTransitionName: activeAnimeId.value === id ? animeViewTransitionNames[part] : 'none'
    }
  }

  return {
    clearAnimeViewTransition,
    destinationViewTransitionStyle,
    markAnimeViewTransition,
    sourceViewTransitionStyle
  }
}
