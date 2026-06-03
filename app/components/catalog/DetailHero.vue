<script setup lang="ts">
import type { AnimeDetail } from '@/types/anime'
import { formatDuration, formatKind, watchPath } from '@/utils/anime'

defineProps<{
  media: AnimeDetail
}>()

const { destinationViewTransitionStyle } = useAnimeViewTransition()

function formatArchiveDate(value: string | null) {
  if (!value) return 'Unknown'
  const [year, month, day] = value.split('-').map(part => Number.parseInt(part, 10))
  if (!year || !month || !day) return value

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

function airedRange(media: AnimeDetail) {
  const start = formatArchiveDate(media.startDate)
  const end = media.endDate ? formatArchiveDate(media.endDate) : null

  return end && end !== 'Unknown' ? `${start} to ${end}` : start
}
</script>

<template>
  <section class="relative isolate overflow-hidden bg-[#201f31]">
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <img
        class="h-full w-full origin-left scale-125 object-cover object-center opacity-55 blur-[30px] saturate-125"
        :src="media.coverImage"
        alt=""
        aria-hidden="true"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,31,49,.34)_0%,rgba(32,31,49,.46)_28%,rgba(32,31,49,.76)_72%,rgba(32,31,49,.9)_100%)] max-[760px]:bg-[linear-gradient(180deg,rgba(32,31,49,.62)_0%,rgba(32,31,49,.72)_48%,rgba(32,31,49,.95)_100%)]" />
      <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#201f31]" />
    </div>

    <div class="mx-auto grid min-h-[620px] w-full max-w-[1300px] grid-cols-[182px_minmax(0,1fr)_330px] gap-[60px] px-[15px] pb-12 pt-[70px] max-[1180px]:grid-cols-[180px_minmax(0,1fr)] max-[1180px]:gap-8 max-[760px]:min-h-0 max-[760px]:grid-cols-1 max-[760px]:gap-0 max-[760px]:px-5 max-[760px]:pb-0 max-[760px]:pt-20">
      <div class="pt-[70px] max-[760px]:flex max-[760px]:justify-center max-[760px]:pt-0">
        <div class="w-[182px] max-[760px]:w-[140px]">
          <img
            class="aspect-[46/65] w-full object-cover"
            :style="destinationViewTransitionStyle('cover', media.id)"
            :src="media.coverImage"
            :alt="media.displayTitle"
            width="460"
            height="650"
            fetchpriority="high"
          >
          <ULink raw :to="`/filter?search=${encodeURIComponent(media.displayTitle)}`" class="flex h-[38px] items-center justify-center gap-2 bg-[#11101d] text-sm font-semibold text-white hover:text-primary max-[760px]:h-8 max-[760px]:text-xs">
            <UIcon name="i-lucide-radio-tower" class="size-4 text-primary" />
            Watch2gether
          </ULink>
        </div>
      </div>

      <div class="pt-[72px] max-[760px]:pt-7 max-[760px]:text-center">
        <nav class="mb-6 text-sm text-white/62 max-[760px]:hidden" aria-label="Breadcrumb">
          <ULink raw to="/home" class="text-white hover:text-primary">Home</ULink>
          <span class="mx-2">•</span>
          <ULink raw :to="`/filter?format=${media.badges.format || 'TV'}`" class="text-white hover:text-primary">{{ formatKind(media.badges.format) }}</ULink>
          <span class="mx-2">•</span>
          <span>{{ media.displayTitle }}</span>
        </nav>

        <h1 class="max-w-[760px] text-[clamp(2.2rem,3.2vw,2.9rem)] font-semibold leading-[1.08] text-white max-[760px]:mx-auto max-[760px]:max-w-[340px] max-[760px]:text-[25px]" :style="destinationViewTransitionStyle('title', media.id)">
          {{ media.displayTitle }}
        </h1>

        <div class="mt-7 flex flex-wrap items-center gap-2 text-sm text-white max-[760px]:mt-6 max-[760px]:justify-center" :style="destinationViewTransitionStyle('meta', media.id)">
          <span class="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-[#111]">PG-13</span>
          <span class="rounded bg-[var(--ui-color-primary-500)] px-1.5 py-0.5 text-xs font-semibold text-[#111]">HD</span>
          <span v-if="media.badges.episodes" class="inline-flex items-center gap-1 rounded bg-[#b0e3af] px-1.5 py-0.5 text-xs font-semibold text-[#111]">
            <UIcon name="i-lucide-captions" class="size-3" />
            {{ media.badges.episodes }}
          </span>
          <span v-if="media.badges.averageScore" class="inline-flex items-center gap-1 rounded bg-[#b9e7ff] px-1.5 py-0.5 text-xs font-semibold text-[#111]">
            <UIcon name="i-lucide-mic" class="size-3" />
            {{ media.badges.averageScore }}
          </span>
          <span v-if="media.badges.episodes" class="rounded bg-white/25 px-1.5 py-0.5 text-xs font-semibold text-white">{{ media.badges.episodes }}</span>
          <span class="text-white/50">•</span>
          <span>{{ formatKind(media.badges.format) }}</span>
          <span class="text-white/50">•</span>
          <span>{{ formatDuration(media.badges.duration) }}</span>
        </div>

        <div class="my-9 flex flex-wrap gap-3 max-[760px]:my-8 max-[760px]:justify-center">
          <UButton :to="watchPath(media)" size="lg" icon="i-lucide-play" class="h-[42px] rounded-full bg-[var(--ui-color-primary-500)] px-6 text-base font-medium text-[#111] ring-0 hover:bg-[var(--ui-color-primary-500)] max-[760px]:h-[42px] max-[760px]:px-8">
            Watch now
          </UButton>
        </div>

        <p class="max-w-[740px] whitespace-pre-line text-sm leading-[1.55] text-white max-[760px]:hidden">
          {{ media.description }}
        </p>

        <p class="mt-6 max-w-[740px] text-sm leading-[1.55] text-white max-[760px]:hidden">
          HiAnime is the best site to watch <strong>{{ media.displayTitle }}</strong> SUB online, or you can even watch <strong>{{ media.displayTitle }}</strong> DUB in HD quality.
          <template v-if="media.studios.length"> You can also find <strong>{{ media.studios[0] }}</strong> anime on HiAnime website.</template>
        </p>

        <div class="mt-9 text-left max-[760px]:mb-6">
          <strong class="block text-sm font-semibold text-primary">Share Anime</strong>
          <p class="text-base text-white">to your friends</p>
        </div>
      </div>

      <aside class="relative isolate self-stretch px-[30px] pt-[122px] before:absolute before:inset-y-0 before:left-0 before:right-[calc((((100vw-min(100vw,1300px))/2)+15px)*-1)] before:z-[-1] before:bg-white/[0.06] max-[1180px]:col-span-full max-[1180px]:px-0 max-[1180px]:pt-0 max-[1180px]:before:hidden max-[760px]:mx-[-20px] max-[760px]:bg-white/[0.05] max-[760px]:px-5 max-[760px]:py-6">
        <div class="grid gap-3 text-sm leading-snug text-white">
          <div class="hidden max-[760px]:block">
            <strong class="mb-3 block">Overview:</strong>
            <p class="max-h-[96px] overflow-y-auto pr-3 text-white/72">{{ media.description }}</p>
          </div>
          <p><strong>Japanese:</strong> <span class="ml-1">{{ media.nativeTitle || 'Unknown' }}</span></p>
          <p v-if="media.synonyms.length"><strong>Synonyms:</strong> <span class="ml-1">{{ media.synonyms.slice(0, 4).join(', ') }}</span></p>
          <p><strong>Aired:</strong> <span class="ml-1">{{ airedRange(media) }}</span></p>
          <p><strong>Premiered:</strong> <span class="ml-1">{{ media.seasonYear || 'Unknown' }}</span></p>
          <p><strong>Duration:</strong> <span class="ml-1">{{ formatDuration(media.badges.duration) }}</span></p>
          <p><strong>Status:</strong> <span class="ml-1">{{ formatKind(media.badges.status) }}</span></p>
          <p><strong>AniList Score:</strong> <span class="ml-1">{{ media.badges.averageScore ? (media.badges.averageScore / 10).toFixed(1) : 'Unknown' }}</span></p>
          <div v-if="media.genres.length" class="border-t border-white/10 pt-3">
            <strong>Genres:</strong>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <ULink v-for="genre in media.genres" :key="genre" raw :to="`/filter?genre=${encodeURIComponent(genre)}`" class="rounded-full border border-white/25 px-2.5 py-1 text-xs text-white hover:border-[var(--ui-color-primary-500)] hover:text-primary">
                {{ genre }}
              </ULink>
            </div>
          </div>
          <p v-if="media.studios.length" class="border-t border-white/10 pt-3"><strong>Studios:</strong> <span class="ml-1">{{ media.studios.join(', ') }}</span></p>
          <p v-if="media.producers.length"><strong>Producers:</strong> <span class="ml-1">{{ media.producers.slice(0, 4).join(', ') }}</span></p>
        </div>
      </aside>
    </div>
  </section>
</template>
