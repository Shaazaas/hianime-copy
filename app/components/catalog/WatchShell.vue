<script setup lang="ts">
import type { AnimeDetail } from '@/types/anime'
import type { AniLinkPlayerEvent, AniLinkVariant } from '@/utils/anilink'
import { buildAniLinkEmbedUrl, isAniLinkPlayerEvent } from '@/utils/anilink'
import { formatAiringDate, formatCountdown, nextAiringDate, releasedEpisodeCount } from '@/utils/anime'

const props = defineProps<{
  media: AnimeDetail
  selected: number
  activeEpisode?: number
  expanded?: boolean
  start?: number
  initialVariant?: AniLinkVariant
}>()

const emit = defineEmits<{
  'update:expanded': [value: boolean]
  'episode-change': [value: number]
  'variant-change': [value: AniLinkVariant]
}>()

const lightsOff = ref(false)
const scheduleVisible = ref(true)
const variant = ref<AniLinkVariant>('sub')
const embedEpisode = ref(props.selected)
const embedVariant = ref<AniLinkVariant>('sub')
const embedStart = ref(props.start)
const autoplay = ref(false)
const muted = ref(false)
const autonext = ref(false)
const autoskipIntro = ref(false)
const autoskipOutro = ref(false)
const playerError = ref('')
const playerStatus = ref<'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'>('loading')
const currentPosition = ref(props.start || 0)
const currentDuration = ref<number | undefined>(undefined)
const lastPlayerAction = ref('')
const playerReloadNonce = ref(0)
const countdownSeconds = ref(props.media.nextAiringEpisode?.timeUntilAiring || 0)
const { advanceToNextEpisode, load: loadContinueWatching, upsertProgress } = useAniLinkContinueWatching()
let removeMessageListener = () => {}
let progressWriteTimer: ReturnType<typeof window.setTimeout> | null = null
let pendingProgress: Parameters<typeof upsertProgress>[0] | null = null
let countdownTimer: ReturnType<typeof window.setInterval> | null = null

const availableEpisodeCount = computed(() => releasedEpisodeCount(props.media))
const currentEpisode = computed(() => {
  const episode = props.activeEpisode || props.selected
  const count = availableEpisodeCount.value

  return count ? Math.min(episode, count) : episode
})
const nextEpisode = computed(() => {
  const count = availableEpisodeCount.value
  if (!count) return null

  return Math.min(currentEpisode.value + 1, count)
})

const previousEpisode = computed(() => currentEpisode.value > 1 ? currentEpisode.value - 1 : null)
const playerClass = computed(() => props.expanded
  ? 'aspect-video h-auto'
  : 'h-[570px] max-[1599px]:h-[460px] max-[1400px]:aspect-video max-[1400px]:h-auto')
const embedUrl = computed(() => buildAniLinkEmbedUrl({
  anilistId: props.media.id,
  episodeNumber: embedEpisode.value,
  variant: embedVariant.value,
  autoplay: autoplay.value,
  muted: muted.value,
  autonext: autonext.value,
  autoskipIntro: autoskipIntro.value,
  autoskipOutro: autoskipOutro.value,
  start: embedStart.value && embedStart.value > 0 ? embedStart.value : undefined,
  primaryColor: '#ffbade',
  secondaryColor: '#ffffff',
  iconColor: '#ffffff'
}))
const loadingVisible = computed(() => playerStatus.value === 'loading' && !playerError.value)
const alternateVariant = computed<AniLinkVariant>(() => variant.value === 'sub' ? 'dub' : 'sub')
const nextAiringAt = computed(() => nextAiringDate(props.media))
const nextAiringLabel = computed(() => formatAiringDate(nextAiringAt.value))
const nextAiringCountdown = computed(() => formatCountdown(countdownSeconds.value))
const playerStatusLabel = computed(() => {
  if (playerError.value || playerStatus.value === 'error') return 'Error'
  if (lastPlayerAction.value) return lastPlayerAction.value
  if (playerStatus.value === 'loading') return 'Loading'
  if (playerStatus.value === 'ready') return 'Ready'
  if (playerStatus.value === 'playing') return 'Playing'
  if (playerStatus.value === 'paused') return 'Paused'
  if (playerStatus.value === 'ended') return 'Ended'

  return 'Unavailable'
})

function loadPreference(name: string, fallback: boolean) {
  if (!import.meta.client) return fallback

  return window.localStorage.getItem(`hianime:anilink:${name}`) === 'true'
}

function savePreference(name: string, value: boolean | string) {
  if (!import.meta.client) return

  window.localStorage.setItem(`hianime:anilink:${name}`, String(value))
}

function togglePreference(name: 'autoplay' | 'muted' | 'autonext' | 'autoskipIntro' | 'autoskipOutro') {
  const preferences = {
    autoplay,
    muted,
    autonext,
    autoskipIntro,
    autoskipOutro
  }
  const target = preferences[name]

  embedEpisode.value = currentEpisode.value
  embedVariant.value = variant.value
  embedStart.value = currentPosition.value > 0 ? currentPosition.value : undefined
  playerStatus.value = 'loading'
  target.value = !target.value
  savePreference(name, target.value)
}

function selectVariant(nextVariant: AniLinkVariant) {
  variant.value = nextVariant
  embedEpisode.value = currentEpisode.value
  embedVariant.value = nextVariant
  embedStart.value = currentPosition.value > 0 ? currentPosition.value : undefined
  playerStatus.value = 'loading'
  savePreference('variant', nextVariant)
  emit('variant-change', nextVariant)
}

function retryPlayback() {
  playerError.value = ''
  playerStatus.value = 'loading'
  embedEpisode.value = currentEpisode.value
  embedVariant.value = variant.value
  embedStart.value = currentPosition.value > 0 ? currentPosition.value : undefined
  playerReloadNonce.value += 1
}

function tryAlternateVariant() {
  playerError.value = ''
  selectVariant(alternateVariant.value)
}

function episodePath(episode: number) {
  return {
    path: `/watch/${props.media.slug}`,
    query: {
      ep: String(episode),
      variant: variant.value
    }
  }
}

function clearProgressWriteTimer() {
  if (!progressWriteTimer) return

  window.clearTimeout(progressWriteTimer)
  progressWriteTimer = null
}

function flushPendingProgress() {
  if (!pendingProgress) return

  clearProgressWriteTimer()
  upsertProgress(pendingProgress)
  pendingProgress = null
}

function writeProgress(input: Parameters<typeof upsertProgress>[0], immediate = false) {
  if (immediate) {
    pendingProgress = input
    flushPendingProgress()
    return
  }

  pendingProgress = input
  clearProgressWriteTimer()
  progressWriteTimer = window.setTimeout(flushPendingProgress, 2500)
}

function updateCountdown() {
  const airingAt = props.media.nextAiringEpisode?.airingAt
  if (!airingAt) return

  countdownSeconds.value = Math.max(0, Math.floor(airingAt - Date.now() / 1000))
}

function handleAniLinkEvent(event: AniLinkPlayerEvent) {
  const eventName = event.type.replace('anilink-player:', '')
  const payload = event.payload

  if (eventName === 'error') {
    playerError.value = payload.message || 'Playback failed. Try another option or refresh.'
    playerStatus.value = 'error'
    return
  }

  if (eventName === 'ready' || eventName === 'play') {
    playerError.value = ''
  }

  if (eventName === 'ready') {
    playerStatus.value = 'ready'
    lastPlayerAction.value = ''
  }
  if (eventName === 'play') {
    playerStatus.value = 'playing'
    lastPlayerAction.value = ''
  }
  if (eventName === 'pause') {
    playerStatus.value = 'paused'
    lastPlayerAction.value = ''
  }
  if (eventName === 'ended') playerStatus.value = 'ended'
  if (eventName === 'fullscreenchange') {
    lastPlayerAction.value = payload.fullscreen === true ? 'Fullscreen' : ''
  }
  if (eventName === 'markerschange') lastPlayerAction.value = payload.marker ? `${payload.marker} marker available` : ''
  if (eventName === 'skip') lastPlayerAction.value = payload.marker ? `Skipped ${payload.marker}` : 'Skipped marker'
  if (eventName === 'autonext') lastPlayerAction.value = 'Auto Next changed episode'

  const hasEpisodeNumber = Number.isFinite(payload.episodeNumber) && Number(payload.episodeNumber) > 0
  const episodeNumber = hasEpisodeNumber
    ? Math.floor(Number(payload.episodeNumber))
    : currentEpisode.value
  const eventVariant = payload.variant === 'sub' || payload.variant === 'dub' ? payload.variant : variant.value

  const hasPosition = typeof payload.position === 'number' && Number.isFinite(payload.position)
  const hasDuration = typeof payload.duration === 'number' && Number.isFinite(payload.duration) && payload.duration > 0

  if (hasPosition) {
    currentPosition.value = Math.max(0, payload.position)
  }

  if (hasDuration) {
    currentDuration.value = payload.duration
  }

  if (eventVariant !== variant.value) {
    variant.value = eventVariant
    savePreference('variant', eventVariant)
    emit('variant-change', eventVariant)
  }

  if (hasEpisodeNumber && episodeNumber !== currentEpisode.value) {
    currentPosition.value = hasPosition ? currentPosition.value : 0
    currentDuration.value = hasDuration ? currentDuration.value : undefined
    emit('episode-change', episodeNumber)
  }

  if (eventName === 'ended') {
    pendingProgress = null
    clearProgressWriteTimer()
    advanceToNextEpisode({
      media: props.media,
      completedEpisodeNumber: episodeNumber,
      nextEpisodeNumber: availableEpisodeCount.value && episodeNumber < availableEpisodeCount.value ? episodeNumber + 1 : null,
      variant: eventVariant
    })
    return
  }

  if (eventName === 'progress' || eventName === 'pause' || eventName === 'episodechange') {
    if (typeof payload.position !== 'number') return

    writeProgress({
      media: props.media,
      episodeNumber,
      variant: eventVariant,
      position: payload.position,
      duration: typeof payload.duration === 'number' ? payload.duration : undefined
    }, eventName !== 'progress')
  }
}

onMounted(() => {
  loadContinueWatching()
  variant.value = props.initialVariant || (window.localStorage.getItem('hianime:anilink:variant') === 'dub' ? 'dub' : 'sub')
  embedVariant.value = variant.value
  emit('variant-change', variant.value)
  autoplay.value = loadPreference('autoplay', false)
  muted.value = loadPreference('muted', false)
  autonext.value = loadPreference('autonext', false)
  autoskipIntro.value = loadPreference('autoskipIntro', false)
  autoskipOutro.value = loadPreference('autoskipOutro', false)

  const listener = (event: MessageEvent) => {
    if (event.origin !== new URL(embedUrl.value).origin) return
    if (isAniLinkPlayerEvent(event.data)) handleAniLinkEvent(event.data)
  }

  window.addEventListener('message', listener)
  removeMessageListener = () => window.removeEventListener('message', listener)

  if (props.media.nextAiringEpisode) {
    updateCountdown()
    countdownTimer = window.setInterval(updateCountdown, 1000)
  }
})

watch(() => props.selected, (episode) => {
  embedEpisode.value = episode
  embedStart.value = props.start
  currentPosition.value = props.start || 0
  currentDuration.value = undefined
  playerStatus.value = 'loading'
})

watch(() => props.start, (start) => {
  embedStart.value = start
  currentPosition.value = start || 0
})

watch(() => props.initialVariant, (nextVariant) => {
  if (!nextVariant) return

  variant.value = nextVariant
  embedVariant.value = nextVariant
  emit('variant-change', nextVariant)
})

onBeforeUnmount(() => {
  flushPendingProgress()
  if (countdownTimer) window.clearInterval(countdownTimer)
  removeMessageListener()
})
</script>

<template>
  <Teleport to="body">
    <button
      v-if="lightsOff"
      type="button"
      class="fixed inset-0 z-[103] cursor-default bg-black/80"
      aria-label="Turn lights back on"
      @click="lightsOff = false"
    />
  </Teleport>

  <section class="relative min-w-0" :class="{ 'z-[104]': lightsOff }">
    <div class="overflow-hidden bg-black">
      <div class="relative overflow-hidden bg-black text-white" :class="playerClass">
        <iframe
          :key="`${embedUrl}-${playerReloadNonce}`"
          :src="embedUrl"
          :title="`${media.displayTitle} Episode ${currentEpisode}`"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          class="absolute inset-0 block h-full w-full border-0"
        />
        <div v-if="loadingVisible" class="pointer-events-none absolute inset-0 z-[2] grid place-items-center bg-black text-white">
          <div class="inline-flex items-center gap-2 text-sm font-medium text-white/80">
            <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin text-[#ffbade]" />
            <span>Loading</span>
          </div>
        </div>
        <div v-if="playerError" class="absolute inset-x-4 top-4 z-[2] flex flex-wrap items-center gap-x-3 gap-y-2 rounded bg-[#2d2b44]/95 px-4 py-3 text-sm text-white shadow-lg ring-1 ring-white/10">
          <span class="min-w-0 flex-1"><strong class="mr-1 text-[#ffbade]">Player error:</strong>{{ playerError }}</span>
          <div class="flex items-center gap-2">
            <button type="button" class="h-7 rounded-[3px] bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/15 hover:text-[#ffbade]" @click="tryAlternateVariant">
              Try {{ alternateVariant.toUpperCase() }}
            </button>
            <button type="button" class="h-7 rounded-[3px] bg-[#ffbade] px-3 text-xs font-semibold text-[#111] hover:bg-[#ffcae6]" @click="retryPlayback">
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex min-h-10 flex-wrap items-center bg-[#11101a] p-[5px] text-[13px] text-white">
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center justify-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] active:scale-[0.98] max-[520px]:m-0.5 max-[520px]:size-8 max-[520px]:px-0"
        :aria-pressed="expanded"
        :aria-label="expanded ? 'Collapse player' : 'Expand player'"
        @click="emit('update:expanded', !expanded)"
      >
        <UIcon :name="expanded ? 'i-lucide-minimize' : 'i-lucide-maximize'" class="size-4" :class="expanded ? 'max-[520px]:text-[#ffbade]' : ''" />
        <span class="max-[520px]:hidden">{{ expanded ? 'Collapse' : 'Expand' }}</span>
      </button>
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center justify-center gap-2 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] active:scale-[0.98] max-[520px]:m-0.5 max-[520px]:size-8 max-[520px]:px-0"
        :aria-pressed="lightsOff"
        aria-label="Toggle light"
        @click="lightsOff = !lightsOff"
      >
        <UIcon name="i-lucide-lightbulb" class="size-4" :class="lightsOff ? 'max-[520px]:text-[#ffbade]' : ''" />
        <span class="max-[520px]:hidden">Light</span>
      </button>
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center justify-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] active:scale-[0.98] max-[520px]:m-0.5 max-[520px]:size-8 max-[520px]:px-0"
        :aria-pressed="autoplay"
        aria-label="Toggle autoplay"
        @click="togglePreference('autoplay')"
      >
        <UIcon name="i-lucide-circle-play" class="hidden size-4 max-[520px]:block" :class="autoplay ? 'max-[520px]:text-[#ffbade]' : ''" />
        <span class="max-[520px]:hidden">Auto Play</span>
        <span class="ml-0.5 font-medium max-[520px]:hidden" :class="autoplay ? 'text-[#b0e3af]' : 'text-[#ff3f29]'">{{ autoplay ? 'On' : 'Off' }}</span>
      </button>
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center justify-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] active:scale-[0.98] max-[520px]:m-0.5 max-[520px]:size-8 max-[520px]:px-0"
        :aria-pressed="muted"
        aria-label="Toggle muted playback"
        @click="togglePreference('muted')"
      >
        <UIcon :name="muted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'" class="hidden size-4 max-[520px]:block" :class="muted ? 'max-[520px]:text-[#ffbade]' : ''" />
        <span class="max-[520px]:hidden">Muted</span>
        <span class="ml-0.5 font-medium max-[520px]:hidden" :class="muted ? 'text-[#b0e3af]' : 'text-[#ff3f29]'">{{ muted ? 'On' : 'Off' }}</span>
      </button>
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center justify-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] active:scale-[0.98] max-[520px]:m-0.5 max-[520px]:size-8 max-[520px]:px-0"
        :aria-pressed="autonext"
        aria-label="Toggle auto next"
        @click="togglePreference('autonext')"
      >
        <UIcon name="i-lucide-skip-forward" class="hidden size-4 max-[520px]:block" :class="autonext ? 'max-[520px]:text-[#ffbade]' : ''" />
        <span class="max-[520px]:hidden">Auto Next</span>
        <span class="ml-0.5 font-medium max-[520px]:hidden" :class="autonext ? 'text-[#b0e3af]' : 'text-[#ff3f29]'">{{ autonext ? 'On' : 'Off' }}</span>
      </button>
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center justify-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] active:scale-[0.98] max-[520px]:m-0.5 max-[520px]:size-8 max-[520px]:px-0"
        :aria-pressed="autoskipIntro"
        aria-label="Toggle auto skip intro"
        @click="togglePreference('autoskipIntro')"
      >
        <UIcon name="i-lucide-scissors" class="hidden size-4 max-[520px]:block" :class="autoskipIntro ? 'max-[520px]:text-[#ffbade]' : ''" />
        <span class="max-[520px]:hidden">Auto Skip Intro</span>
        <span class="ml-0.5 font-medium max-[520px]:hidden" :class="autoskipIntro ? 'text-[#b0e3af]' : 'text-[#ff3f29]'">{{ autoskipIntro ? 'On' : 'Off' }}</span>
      </button>
      <button
        type="button"
        class="m-[5px] inline-flex h-[30px] items-center justify-center gap-1 rounded-[3px] bg-transparent px-1 text-white/90 hover:text-[#ffbade] active:scale-[0.98] max-[520px]:m-0.5 max-[520px]:size-8 max-[520px]:px-0"
        :aria-pressed="autoskipOutro"
        aria-label="Toggle auto skip outro"
        @click="togglePreference('autoskipOutro')"
      >
        <UIcon name="i-lucide-corner-down-right" class="hidden size-4 max-[520px]:block" :class="autoskipOutro ? 'max-[520px]:text-[#ffbade]' : ''" />
        <span class="max-[520px]:hidden">Auto Skip Outro</span>
        <span class="ml-0.5 font-medium max-[520px]:hidden" :class="autoskipOutro ? 'text-[#b0e3af]' : 'text-[#ff3f29]'">{{ autoskipOutro ? 'On' : 'Off' }}</span>
      </button>
      <div class="ml-auto flex items-center">
        <UButton
          v-if="previousEpisode"
          :to="episodePath(previousEpisode)"
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-chevron-left"
          class="m-[5px] h-[30px] rounded-[3px] px-1 text-[13px] text-white hover:bg-transparent hover:text-[#ffbade]"
        >
          Prev
        </UButton>
        <UButton
          v-if="nextEpisode && nextEpisode !== selected"
          :to="episodePath(nextEpisode)"
          size="sm"
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-chevron-right"
          class="m-[5px] h-[30px] rounded-[3px] px-1 text-[13px] text-white hover:bg-transparent hover:text-[#ffbade]"
        >
          Next
        </UButton>
        <UButton to="/filter?sort=trending" color="neutral" variant="ghost" icon="i-lucide-users" class="m-[5px] h-[30px] rounded-[3px] px-1 text-[13px] text-white hover:bg-transparent hover:text-[#ffbade]">
          <span class="max-[1199px]:hidden">Watch2gether</span><span class="hidden max-[1199px]:inline">Live</span>
        </UButton>
      </div>
    </div>

    <div class="grid min-h-[100px] grid-cols-[230px_minmax(0,1fr)] bg-[#11101a] px-[15px] pb-[15px] max-[640px]:min-h-0 max-[640px]:grid-cols-1 max-[640px]:gap-1.5 max-[640px]:px-2.5 max-[640px]:pb-2.5">
      <div class="relative grid place-items-center rounded-l-md bg-[#ffbade] px-[15px] text-center text-[13px] font-medium leading-[1.3] text-[#111] max-[640px]:min-h-9 max-[640px]:rounded max-[640px]:px-3 max-[640px]:text-left max-[640px]:text-xs">
        <span class="max-[640px]:hidden"><strong class="mb-1 block font-medium">You are watching</strong>Episode {{ currentEpisode }} {{ variant.toUpperCase() }}</span>
        <span class="hidden w-full items-center justify-between gap-2 max-[640px]:flex">
          <strong class="font-semibold">Watching</strong>
          <span class="truncate font-medium">E{{ currentEpisode }} {{ variant.toUpperCase() }}</span>
        </span>
      </div>
      <div class="grid min-h-[100px] content-center gap-3 rounded-r-md bg-[#201f31] px-[15px] py-4 text-[13px] text-white/60 max-[640px]:min-h-0 max-[640px]:gap-1.5 max-[640px]:rounded max-[640px]:px-2 max-[640px]:py-2 max-[640px]:text-xs">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 max-[640px]:grid max-[640px]:w-full max-[640px]:grid-cols-[34px_auto_minmax(0,1fr)] max-[640px]:gap-1.5">
          <span class="w-[58px] shrink-0 text-right font-semibold text-white max-[640px]:w-auto max-[640px]:text-left max-[640px]:text-[11px]">SUB</span>
          <button
            type="button"
            class="inline-flex h-8 min-w-[92px] items-center justify-center gap-1 rounded-[3px] px-3 text-xs font-semibold transition-colors active:scale-[0.98] max-[640px]:h-7 max-[640px]:min-w-[72px] max-[640px]:px-2.5 max-[640px]:text-[11px]"
            :class="variant === 'sub' ? 'bg-[#ffbade] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.35)]' : 'bg-white/10 text-white hover:bg-white/15 hover:text-[#ffbade]'"
            :aria-pressed="variant === 'sub'"
            @click="selectVariant('sub')"
          >
            <UIcon name="i-lucide-play" class="size-3.5" />
            HD-1
          </button>
          <span v-if="variant === 'sub'" class="text-xs text-white/45 max-[640px]:min-w-0 max-[640px]:truncate max-[640px]:text-right max-[640px]:text-[11px]">{{ playerStatusLabel }}</span>
          <span v-else class="hidden max-[640px]:block" aria-hidden="true" />
        </div>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 max-[640px]:grid max-[640px]:w-full max-[640px]:grid-cols-[34px_auto_minmax(0,1fr)] max-[640px]:gap-1.5">
          <span class="w-[58px] shrink-0 text-right font-semibold text-white max-[640px]:w-auto max-[640px]:text-left max-[640px]:text-[11px]">DUB</span>
          <button
            type="button"
            class="inline-flex h-8 min-w-[92px] items-center justify-center gap-1 rounded-[3px] px-3 text-xs font-semibold transition-colors active:scale-[0.98] max-[640px]:h-7 max-[640px]:min-w-[72px] max-[640px]:px-2.5 max-[640px]:text-[11px]"
            :class="variant === 'dub' ? 'bg-[#ffbade] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.35)]' : 'bg-white/10 text-white hover:bg-white/15 hover:text-[#ffbade]'"
            :aria-pressed="variant === 'dub'"
            @click="selectVariant('dub')"
          >
            <UIcon name="i-lucide-play" class="size-3.5" />
            HD-1
          </button>
          <span v-if="variant === 'dub'" class="text-xs text-white/45 max-[640px]:min-w-0 max-[640px]:truncate max-[640px]:text-right max-[640px]:text-[11px]">{{ playerStatusLabel }}</span>
          <span v-else class="hidden max-[640px]:block" aria-hidden="true" />
        </div>
      </div>
    </div>

    <div v-if="scheduleVisible && media.nextAiringEpisode && nextAiringLabel" class="bg-[#11101a] px-[15px] pb-[15px]">
      <div class="rounded-md bg-[#08c] px-[15px] py-3 text-left text-xs font-medium leading-[1.5] text-white">
        <button type="button" class="float-right -mt-1 text-xl leading-none text-white/80" aria-label="Dismiss schedule alert" @click="scheduleVisible = false">×</button>
        <UIcon name="i-lucide-rocket" class="mr-1 inline-block size-4 align-[-3px]" />
        Episode {{ media.nextAiringEpisode.episode }} releases {{ nextAiringLabel }}.
        <span class="ml-1 rounded bg-white/20 px-1.5 py-0.5 font-semibold">{{ nextAiringCountdown }}</span>
      </div>
    </div>

  </section>
</template>
