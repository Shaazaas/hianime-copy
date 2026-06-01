export interface AnimeTitle {
  romaji: string
  english: string | null
  native: string | null
}

export interface AnimeBadgeSet {
  episodes: number | null
  duration: number | null
  format: string | null
  status: string | null
  averageScore: number | null
}

export interface AnimeListItem {
  id: number
  slug: string
  title: AnimeTitle
  displayTitle: string
  description: string
  coverImage: string
  bannerImage: string | null
  seasonYear: number | null
  genres: string[]
  badges: AnimeBadgeSet
}

export interface AnimeCharacter {
  id: number
  name: string
  image: string | null
  role: string | null
  voiceActor: {
    name: string
    image: string | null
    language: string | null
  } | null
}

export interface AnimeDetail extends AnimeListItem {
  nativeTitle: string | null
  synonyms: string[]
  startDate: string | null
  endDate: string | null
  studios: string[]
  producers: string[]
  characters: AnimeCharacter[]
  recommendations: AnimeListItem[]
}

export interface HomeCatalog {
  spotlight: AnimeListItem[]
  trending: AnimeListItem[]
  topAiring: AnimeListItem[]
  popular: AnimeListItem[]
  favourites: AnimeListItem[]
  completed: AnimeListItem[]
  recommended: AnimeListItem[]
  top: AnimeListItem[]
  schedule: AnimeListItem[]
}

export interface FilterCatalog {
  items: AnimeListItem[]
  page: number
  total: number
  hasNextPage: boolean
}
