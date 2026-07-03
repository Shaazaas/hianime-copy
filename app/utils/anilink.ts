import type { AnimeDetail, AnimeListItem } from '@/types/anime'

export type AniLinkVariant = 'sub' | 'dub'

export type AniLinkPlayerEventName =
  | 'ready'
  | 'play'
  | 'pause'
  | 'ended'
  | 'episodechange'
  | 'variantchange'
  | 'fullscreenchange'
  | 'markerschange'
  | 'autonext'
  | 'skip'
  | 'progress'
  | 'error'

export type AniLinkPlayerEvent = {
  type: `anilink-player:${AniLinkPlayerEventName}`
  payload: {
    anilistId?: number
    episodeNumber?: number
    variant?: AniLinkVariant
    position?: number
    duration?: number
    marker?: 'intro' | 'outro'
    automatic?: boolean
    code?: string
    message?: string
    [key: string]: unknown
  }
}

const aniLinkEventNames = new Set<AniLinkPlayerEventName>([
  'ready',
  'play',
  'pause',
  'ended',
  'episodechange',
  'variantchange',
  'fullscreenchange',
  'markerschange',
  'autonext',
  'skip',
  'progress',
  'error'
])

export type AniLinkEmbedOptions = {
  origin?: string
  anilistId: number
  episodeNumber: number
  variant: AniLinkVariant
  autoplay?: boolean
  muted?: boolean
  autonext?: boolean
  autoskipIntro?: boolean
  autoskipOutro?: boolean
  start?: number
  primaryColor?: string
  secondaryColor?: string
  iconColor?: string
}

export type AniLinkContinueWatchingItem = {
  anilistId: number
  slug: string
  title: string
  coverImage: string
  episodeNumber: number
  variant: AniLinkVariant
  position: number
  duration?: number
  updatedAt: string
}

export type AniLinkContinueWatchingMedia = Pick<AnimeListItem | AnimeDetail, 'id' | 'slug' | 'displayTitle' | 'coverImage'>

export function buildAniLinkEmbedUrl(options: AniLinkEmbedOptions) {
  const origin = (options.origin ?? 'http://localhost:3001').replace(/\/+$/, '')
  const params = new URLSearchParams({ variant: options.variant })
  const addBoolean = (name: string, value: boolean | undefined) => {
    if (value !== undefined) params.set(name, String(value))
  }
  const addHex = (name: string, value: string | undefined) => {
    if (value) params.set(name, value.replace(/^#/, ''))
  }

  addBoolean('autoplay', options.autoplay)
  addBoolean('muted', options.muted)
  addBoolean('autonext', options.autonext)
  addBoolean('autoskipIntro', options.autoskipIntro)
  addBoolean('autoskipOutro', options.autoskipOutro)
  if (Number.isFinite(options.start) && options.start! > 0) {
    params.set('start', String(Math.floor(options.start!)))
  }
  addHex('primaryColor', options.primaryColor)
  addHex('secondaryColor', options.secondaryColor)
  addHex('iconColor', options.iconColor)

  return `${origin}/watch/${options.anilistId}/${options.episodeNumber}?${params}`
}

export function isAniLinkPlayerEvent(value: unknown): value is AniLinkPlayerEvent {
  if (!value || typeof value !== 'object') return false
  const event = value as { type?: unknown, payload?: unknown }
  const eventName = typeof event.type === 'string' ? event.type.replace('anilink-player:', '') : ''

  return (
    typeof event.type === 'string'
    && event.type.startsWith('anilink-player:')
    && aniLinkEventNames.has(eventName as AniLinkPlayerEventName)
    && Boolean(event.payload)
    && typeof event.payload === 'object'
  )
}

export function formatAniLinkTimestamp(seconds: number) {
  const finiteSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const minutes = Math.floor(finiteSeconds / 60)
  const remainingSeconds = finiteSeconds % 60

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

export function aniLinkWatchPath(item: Pick<AniLinkContinueWatchingItem, 'slug' | 'episodeNumber' | 'variant' | 'position'>) {
  const params = new URLSearchParams({
    ep: String(item.episodeNumber),
    variant: item.variant
  })

  if (item.position > 0) params.set('start', String(Math.floor(item.position)))

  return `/watch/${item.slug}?${params}`
}
