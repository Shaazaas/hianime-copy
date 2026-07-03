import type { AniLinkContinueWatchingItem, AniLinkContinueWatchingMedia, AniLinkVariant } from '@/utils/anilink'

const storageKey = 'hianime:anilink-continue-watching'
const maxItems = 12
const minimumPositionSeconds = 120
const minimumProgressRatio = 0.02
const completionRatio = 0.9
const completionRemainingSeconds = 90

function readItems() {
  if (!import.meta.client) return []

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || '[]')

    if (!Array.isArray(parsed)) return []

    return parsed.filter(isValidItem).slice(0, maxItems)
  } catch {
    return []
  }
}

function writeItems(items: AniLinkContinueWatchingItem[]) {
  if (!import.meta.client) return

  window.localStorage.setItem(storageKey, JSON.stringify(items.slice(0, maxItems)))
}

function isValidItem(value: unknown): value is AniLinkContinueWatchingItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<AniLinkContinueWatchingItem>

  return (
    typeof item.anilistId === 'number'
    && typeof item.slug === 'string'
    && typeof item.title === 'string'
    && typeof item.coverImage === 'string'
    && typeof item.episodeNumber === 'number'
    && (item.variant === 'sub' || item.variant === 'dub')
    && typeof item.position === 'number'
    && typeof item.updatedAt === 'string'
  )
}

function shouldStoreProgress(position: number, duration?: number) {
  if (!Number.isFinite(position) || position <= 0) return false
  if (position >= minimumPositionSeconds) return true
  if (!duration || !Number.isFinite(duration) || duration <= 0) return false

  return position / duration >= minimumProgressRatio
}

function isComplete(position: number, duration?: number) {
  if (!duration || !Number.isFinite(duration) || duration <= 0) return false

  return position / duration >= completionRatio || duration - position <= completionRemainingSeconds
}

export function useAniLinkContinueWatching() {
  const items = useState<AniLinkContinueWatchingItem[]>('anilink-continue-watching-items', () => [])
  const loaded = useState('anilink-continue-watching-loaded', () => false)

  function load() {
    items.value = readItems()
    loaded.value = true
  }

  function persist(nextItems: AniLinkContinueWatchingItem[]) {
    items.value = nextItems
    writeItems(nextItems)
  }

  function remove(anilistId: number, episodeNumber?: number, variant?: AniLinkVariant) {
    persist(items.value.filter((item) => {
      if (item.anilistId !== anilistId) return true
      if (episodeNumber !== undefined && item.episodeNumber !== episodeNumber) return true
      if (variant !== undefined && item.variant !== variant) return true

      return false
    }))
  }

  function upsertProgress(input: {
    media: AniLinkContinueWatchingMedia
    episodeNumber: number
    variant: AniLinkVariant
    position: number
    duration?: number
  }) {
    const position = Math.max(0, Math.floor(input.position))
    const duration = input.duration && Number.isFinite(input.duration) ? Math.floor(input.duration) : undefined

    if (isComplete(position, duration)) {
      remove(input.media.id, input.episodeNumber, input.variant)
      return
    }

    if (!shouldStoreProgress(position, duration)) return

    const nextItem: AniLinkContinueWatchingItem = {
      anilistId: input.media.id,
      slug: input.media.slug,
      title: input.media.displayTitle,
      coverImage: input.media.coverImage,
      episodeNumber: input.episodeNumber,
      variant: input.variant,
      position,
      duration,
      updatedAt: new Date().toISOString()
    }

    const withoutCurrent = items.value.filter((item) => {
      return !(item.anilistId === nextItem.anilistId && item.episodeNumber === nextItem.episodeNumber && item.variant === nextItem.variant)
    })

    persist([nextItem, ...withoutCurrent].slice(0, maxItems))
  }

  function advanceToNextEpisode(input: {
    media: AniLinkContinueWatchingMedia
    completedEpisodeNumber: number
    nextEpisodeNumber?: number | null
    variant: AniLinkVariant
  }) {
    const withoutCompleted = items.value.filter((item) => {
      return !(item.anilistId === input.media.id && item.episodeNumber === input.completedEpisodeNumber && item.variant === input.variant)
    })

    if (!input.nextEpisodeNumber || input.nextEpisodeNumber <= input.completedEpisodeNumber) {
      persist(withoutCompleted)
      return
    }

    const nextItem: AniLinkContinueWatchingItem = {
      anilistId: input.media.id,
      slug: input.media.slug,
      title: input.media.displayTitle,
      coverImage: input.media.coverImage,
      episodeNumber: input.nextEpisodeNumber,
      variant: input.variant,
      position: 0,
      updatedAt: new Date().toISOString()
    }

    const withoutNext = withoutCompleted.filter((item) => {
      return !(item.anilistId === nextItem.anilistId && item.episodeNumber === nextItem.episodeNumber && item.variant === nextItem.variant)
    })

    persist([nextItem, ...withoutNext].slice(0, maxItems))
  }

  function latestForMedia(anilistId: number) {
    return items.value.find(item => item.anilistId === anilistId) || null
  }

  return {
    items,
    advanceToNextEpisode,
    load,
    latestForMedia,
    remove,
    upsertProgress
  }
}
