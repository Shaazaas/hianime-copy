import type { AnimeListItem } from '@/types/anime'

export function animeTitle(media?: Pick<AnimeListItem, 'displayTitle'> | null) {
  return media?.displayTitle || 'Unknown title'
}

export function animeSlug(id: number, title: string) {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return `${id}-${slug || 'anime'}`
}

export function idFromSlug(slug: string | string[] | undefined) {
  const value = Array.isArray(slug) ? slug[0] : slug
  const id = Number.parseInt(value?.split('-')[0] || '', 10)

  return Number.isFinite(id) ? id : null
}

export function detailPath(media: AnimeListItem) {
  return `/anime/${media.slug}`
}

export function watchPath(media: AnimeListItem, episode = 1) {
  const count = releasedEpisodeCount(media)

  return count ? `/watch/${media.slug}?ep=${Math.min(Math.max(episode, 1), count)}` : detailPath(media)
}

export function releasedEpisodeCount(media: Pick<AnimeListItem, 'badges' | 'nextAiringEpisode'>) {
  const nextEpisode = media.nextAiringEpisode?.episode
  const plannedCount = media.badges.episodes

  if (nextEpisode && nextEpisode > 0) {
    const releasedCount = Math.max(0, nextEpisode - 1)

    return plannedCount ? Math.min(releasedCount, plannedCount) : releasedCount
  }

  return plannedCount || 0
}

export function nextAiringDate(media: Pick<AnimeListItem, 'nextAiringEpisode'>) {
  if (!media.nextAiringEpisode?.airingAt) return null

  return new Date(media.nextAiringEpisode.airingAt * 1000)
}

export function formatAiringDate(value: Date | null) {
  if (!value) return null

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(value)
}

export function formatCountdown(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${remainingSeconds}s`
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`

  return `${remainingSeconds}s`
}

export function formatKind(value: string | null) {
  if (!value) return 'Unknown'
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}

export function formatDuration(minutes: number | null) {
  return minutes ? `${minutes} min` : 'Unknown'
}

export function formatDateLabel(value: string | null) {
  if (!value) return 'Unknown'
  return value
}

export function normalizeVisibleText(value: string) {
  return value.replace(/[—–]/g, '-')
}

export function stripHtml(value: string | null | undefined) {
  return (value || 'No description is available from AniList yet.')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}
