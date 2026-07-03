# HiAnime Catalog

This context defines the anime catalog experience being recreated: a HiAnime-inspired browsing interface backed by AniList metadata and a host-owned watch experience.

## Language

**AniList-backed Anime Catalog**:
An anime discovery and detail experience whose titles, images, rankings, schedules, characters, and metadata come from AniList.
_Avoid_: Streaming site, scraper, player API

**Playback Surface**:
A host-owned watch-page surface where selected episodes can be played while the surrounding catalog, episode list, controls, and resume flows remain part of HiAnime.
_Avoid_: Stream API, scraped provider, vendor-owned watch page

**Playback Preferences**:
Viewer-controlled playback choices owned by HiAnime, such as autoplay, muted playback, automatic next episode behavior, and automatic marker skipping.
_Avoid_: Provider settings, iframe defaults, browser settings

**Continue Watching**:
A host-owned resume surface for unfinished episode playback that lets viewers return to a specific title, episode, audio variant, and approximate position.
_Avoid_: Auto-next, watch history, provider account

**Audio Variant**:
The selected episode audio/subtitle presentation, currently represented by SUB or DUB in the watch interface.
_Avoid_: Server, source, language setting

**Episode Selection**:
A routeable catalog interaction that identifies an AniList title and an episode number for the watch experience. The selected episode should remain host-owned even when playback advances it.
_Avoid_: Stream selection, server selection

**Released Episode Count**:
The number of episodes that are currently available for **Episode Selection** according to AniList metadata. For releasing titles, it stops before AniList's next airing episode.
_Avoid_: Total planned episode count, future episode placeholders

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

- An **AniList-backed Anime Catalog** may show a **Playback Surface**
- A **Playback Surface** may embed playback while keeping catalog identity, controls, and resume behavior host-owned
- A **Playback Surface** may apply **Playback Preferences**
- **Continue Watching** resumes a **Playback Surface** from an explicit viewer action
- **Continue Watching** may advance to the next **Episode Selection** after episode completion
- **Continue Watching** includes the selected **Audio Variant**
- **Episode Selection** may be paired with an **Audio Variant**
- **Episode Selection** is limited by the **Released Episode Count**
- **Episode Selection** may update a **Playback Surface**
- A **Playback Surface** may update **Episode Selection** when playback advances episodes
- An **AniList-backed Anime Catalog** uses an **Honest Metadata Fallback** when AniList does not provide exact HiAnime-style data
- A **First-pass Catalog Loop** includes **Episode Selection** but excludes account, comments, favourites, and community features
- **AniList Identity** is the source of truth for anime detail and watch routes
- A **Reserved Panel** may occupy space where an ad appears in the reference screenshots
- A **Catalog Widget** may replace community or trending-post areas when the reference layout needs a sidebar
- **HiAnime** is the public name of the **AniList-backed Anime Catalog**

## Example Dialogue

> **Dev:** "Should the watch page become a separate provider site when the user clicks an episode?"
> **Domain expert:** "No — playback belongs inside the **Playback Surface**. The catalog data still comes from the **AniList-backed Anime Catalog**."

> **Dev:** "Can `/watch/1/3` change which episode is highlighted?"
> **Domain expert:** "Yes — that is **Episode Selection**, and it may update the **Playback Surface**."

> **Dev:** "If playback advances from episode 3 to episode 4, should the episode list still show episode 3?"
> **Domain expert:** "No — **Episode Selection** is host-owned and should follow the current episode."

> **Dev:** "Are Auto Play and Auto Skip provider settings?"
> **Domain expert:** "No — they are **Playback Preferences** owned by HiAnime and applied to the **Playback Surface**."

> **Dev:** "Is Auto Next the same thing as Continue Watching?"
> **Domain expert:** "No — **Continue Watching** is an explicit resume surface for unfinished playback. Auto Next is a **Playback Preference**."

> **Dev:** "If a viewer finishes episode 3, should Continue Watching disappear?"
> **Domain expert:** "No — when another episode exists, **Continue Watching** can advance to episode 4 as the next explicit resume action."

> **Dev:** "Are SUB and DUB servers?"
> **Domain expert:** "No — they are **Audio Variants**. A server or source would be a separate playback provider choice."

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

- "Recreating HiAnime" means recreating the visible catalog, detail, filter, and watch-page layouts from screenshots; it does not mean copying comments, third-party ads, stream APIs, or scraped provider behavior.
- UI primitives are provided by Nuxt UI v4. Compose `U*` components and semantic Nuxt UI theme tokens instead of restoring copied shadcn-vue components.
- AniList data should be fetched through Nuxt server API routes, not directly from Vue components.
- AniList server API responses may use short public caching because catalog metadata is not expected to change minute-by-minute.
- Desktop layouts should match the provided screenshots first; mobile layouts should be usable but not treated as pixel-matched until mobile references exist.
- Screenshot sections such as Top Airing, Most Popular, Most Favourite, Latest Completed, Top 10, and Recommended should map to the closest honest AniList sort or filter.
- "Watch Now" should route to the **Playback Surface** for episode 1 when episodes are known; otherwise it should route to the anime detail page.
- The app should use **HiAnime** as the project name while matching the reference layout, spacing, colors, and interaction patterns.
