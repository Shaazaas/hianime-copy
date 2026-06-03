# HiAnime Catalog

This context defines the anime catalog experience being recreated: a HiAnime-inspired browsing interface backed by AniList metadata, without streaming implementation.

## Language

**AniList-backed Anime Catalog**:
An anime discovery and detail experience whose titles, images, rankings, schedules, characters, and metadata come from AniList.
_Avoid_: Streaming site, scraper, player API

**Playback Placeholder**:
A non-functional watch-page surface that preserves the layout around episode selection and player controls until real playback is designed later.
_Avoid_: Anime player, stream provider, video API

**Episode Selection**:
A routeable catalog interaction that identifies an AniList title and an episode number without loading playable media.
_Avoid_: Stream selection, server selection

**Honest Metadata Fallback**:
A visible omission or clearly labeled substitute used when AniList lacks a field shown in the reference UI.
_Avoid_: Fake counts, copied site rankings, invented schedules

**First-pass Catalog Loop**:
The initial user journey covering home discovery, catalog filtering, search suggestions, anime detail, and episode selection.
_Avoid_: Login flow, favourites management, comments, community, Watch2Gether, real ads

**AniList Identity**:
The stable catalog identity for an anime title, represented by its AniList media ID with a readable title slug for URLs.
_Avoid_: HiAnime slug, scraped provider ID

**HiAnime**:
The project identity for the AniList-backed anime catalog.
_Avoid_: byanime

**Reserved Panel**:
An inert layout region that preserves reference-page geometry without displaying third-party advertising.
_Avoid_: Ad, sponsored banner, cross-site promotion

**Catalog Widget**:
A sidebar or section populated only by AniList-derived anime data.
_Avoid_: Fake post, copied comment, community feed

## Relationships

- An **AniList-backed Anime Catalog** may show a **Playback Placeholder**
- A **Playback Placeholder** must not fetch or embed real streaming media
- **Episode Selection** may update a **Playback Placeholder**
- An **AniList-backed Anime Catalog** uses an **Honest Metadata Fallback** when AniList does not provide exact HiAnime-style data
- A **First-pass Catalog Loop** includes **Episode Selection** but excludes real playback and community features
- **AniList Identity** is the source of truth for anime detail and watch routes
- A **Reserved Panel** may occupy space where an ad appears in the reference screenshots
- A **Catalog Widget** may replace community or trending-post areas when the reference layout needs a sidebar
- **HiAnime** is the public name of the **AniList-backed Anime Catalog**

## Example Dialogue

> **Dev:** "Should the watch page call a video provider when the user clicks an episode?"
> **Domain expert:** "No — for now it is only a **Playback Placeholder**. The catalog data still comes from the **AniList-backed Anime Catalog**."

> **Dev:** "Can `/watch/1/3` change which episode is highlighted?"
> **Domain expert:** "Yes — that is **Episode Selection**, but it still does not imply streaming."

> **Dev:** "AniList does not tell us the exact sub and dub counts for this show. Should we make them up to match the badge layout?"
> **Domain expert:** "No — use an **Honest Metadata Fallback** such as episode count, format, or omit the missing badge."

> **Dev:** "Should login, comments, and favourites work in the first build?"
> **Domain expert:** "No — the **First-pass Catalog Loop** stops at catalog browsing, detail pages, search suggestions, and **Episode Selection**."

> **Dev:** "Should `/anime/21-one-piece` resolve by the slug or the number?"
> **Domain expert:** "Resolve by **AniList Identity**. The slug is only readable decoration."

> **Dev:** "The screenshot has an ad box in the sidebar. Should we copy the ad?"
> **Domain expert:** "No — use a **Reserved Panel** only if the page needs that space to preserve the layout."

> **Dev:** "The screenshot has trending posts. Should we create placeholder community posts?"
> **Domain expert:** "No — use a **Catalog Widget** with AniList data or omit the area."

## Flagged Ambiguities

- "Recreating HiAnime" means recreating the visible catalog, detail, filter, and watch-page layouts from screenshots; it does not mean copying comments, third-party ads, stream APIs, or scraped playback behavior.
- UI primitives are provided by Nuxt UI v4. Compose `U*` components and semantic Nuxt UI theme tokens instead of restoring copied shadcn-vue components.
- AniList data should be fetched through Nuxt server API routes, not directly from Vue components.
- AniList server API responses may use short public caching because catalog metadata is not expected to change minute-by-minute.
- Desktop layouts should match the provided screenshots first; mobile layouts should be usable but not treated as pixel-matched until mobile references exist.
- Screenshot sections such as Top Airing, Most Popular, Most Favourite, Latest Completed, Top 10, and Recommended should map to the closest honest AniList sort or filter.
- "Watch Now" should route to the **Playback Placeholder** for episode 1 when episodes are known; otherwise it should route to the anime detail page.
- The app should use **HiAnime** as the project name while matching the reference layout, spacing, colors, and interaction patterns.
