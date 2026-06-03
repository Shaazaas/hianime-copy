# Codebase Audit Issues

This file tracks the audit findings and the fixes applied for code smells, inconsistent implementation, UI issues, Nuxt UI drift, and Nuxt/Vue structure concerns.

## Issues

### 1. Domain Copy Implied Features That Do Not Exist

**Status**: Fixed

Several UI labels and metadata strings described HiAnime as a streaming or community product even though the glossary defines the current scope as an AniList-backed catalog with a playback placeholder only.

**Affected areas**:
- Landing and home SEO copy
- Header quick links
- Detail hero marketing copy
- Home sidebar community posts
- Fake streaming badges such as HD, SUB, DUB, and PG-13

**Fix**:
Updated copy to describe catalog discovery, replaced community placeholders with AniList-derived catalog widgets, and removed fabricated media capability badges.

### 2. Missing AniList Media Null Handling

**Status**: Fixed

The media detail API validated malformed route IDs, but did not handle a valid ID whose AniList response returned `Media: null`.

**Fix**:
Return a clean `404` before normalizing detail data when AniList does not return a media record.

### 3. Filter Query Validation Drift

**Status**: Fixed

Filter options were duplicated between the filter page and the server route. Invalid pages could pass as negative values, and invalid option values were handled inconsistently.

**Fix**:
Added shared filter option constants and normalization helpers, then used them from both the page and server route.

### 4. Fabricated Episode Counts

**Status**: Fixed

The episode rail defaulted unknown episode counts to `12`, which conflicts with the Honest Metadata Fallback language.

**Fix**:
Unknown episode counts now render an explicit unavailable state instead of inventing episode links.

### 5. Drawer Accessibility

**Status**: Fixed

The header drawer used a `details`/`summary` pattern with a non-interactive "Close menu" label and no accessible close action.

**Fix**:
Replaced it with explicit Vue state, buttons, `aria-expanded`, `aria-modal`, overlay close, and Escape handling.

### 6. Search Suggest Error State

**Status**: Fixed

Search suggestions had a loading state but no visible error or stale-error reset behavior.

**Fix**:
Added an error state, abort-aware cleanup, and updated loading copy to use an ellipsis.

### 7. Nuxt UI Token Drift

**Status**: Fixed

Some Nuxt UI components used raw copied colors and disabled rings. A full visual token migration is larger than this pass.

**Fix**:
Removed the most misleading badge overrides and focus-ring suppression from search controls while keeping the existing HiAnime visual direction.

### 8. pnpm Configuration Warning

**Status**: Fixed

`package.json` contained a `pnpm.onlyBuiltDependencies` block that pnpm 10 no longer reads.

**Fix**:
Removed the ignored package field. The workspace already carries the project pnpm configuration.

### 9. Missing Quality Gate Scripts

**Status**: Fixed

The project had no local script for typechecking or a combined check.

**Fix**:
Added Nuxt ESLint, a root flat ESLint config, `lint`, `typecheck`, and a combined `check` script using the repo's configured package manager.

## Verification

Run after fixes:

```bash
pnpm check
pnpm lint
pnpm build
```
