<script setup lang="ts">
import { Globe, Heart, Menu, MessageCircle, Radio, Send } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import BrandLogo from './BrandLogo.vue'
import SearchSuggest from './SearchSuggest.vue'

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/filter?format=MOVIE' },
  { label: 'TV Series', to: '/filter?format=TV' },
  { label: 'Most Popular', to: '/filter?sort=popular' },
  { label: 'Top Airing', to: '/filter?status=airing' }
]
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <Button variant="ghost" size="icon" aria-label="Open menu" class="app-header__menu">
        <ClientOnly><Menu data-icon="inline-start" /></ClientOnly>
      </Button>
      <BrandLogo />
      <SearchSuggest class="app-header__search" />
      <nav class="app-header__nav" aria-label="Primary">
        <NuxtLink v-for="item in nav" :key="item.label" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>
      <div class="app-header__actions">
        <span><ClientOnly><MessageCircle /></ClientOnly> Discord</span>
        <span><ClientOnly><Send /></ClientOnly> Telegram</span>
        <span><ClientOnly><Radio /></ClientOnly> Community</span>
        <span><ClientOnly><Heart /></ClientOnly> Favourites</span>
        <span><ClientOnly><Globe /></ClientOnly> Social</span>
      </div>
      <Button size="sm" class="app-header__login">Login</Button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  z-index: 30;
  top: 0;
  background: hsl(var(--background) / 0.92);
  backdrop-filter: blur(14px);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 18px;
  width: min(1460px, calc(100% - 48px));
  min-height: 66px;
  margin: 0 auto;
}

.app-header__menu {
  color: hsl(var(--foreground));
}

.app-header__search {
  flex: 0 1 430px;
}

.app-header__nav {
  display: none;
  align-items: center;
  gap: 34px;
  margin-left: auto;
  color: hsl(var(--foreground));
  font-size: 0.92rem;
  font-weight: 700;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
  color: hsl(var(--foreground));
  font-size: 0.74rem;
  font-weight: 600;
}

.app-header__actions span {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.app-header__actions svg {
  width: 22px;
  height: 22px;
  color: hsl(var(--primary));
}

.app-header__login {
  margin-left: 10px;
}

@media (max-width: 1180px) {
  .app-header__actions {
    display: none;
  }
}

@media (max-width: 760px) {
  .app-header__inner {
    flex-wrap: wrap;
    width: min(100% - 28px, 720px);
    gap: 10px;
    padding: 10px 0;
  }

  .app-header__search {
    order: 5;
    flex: 1 1 100%;
    min-width: 0;
    max-width: 100%;
  }

  .app-header__login {
    margin-left: auto;
  }
}

@media (max-width: 420px) {
  .app-header__inner {
    width: min(100% - 20px, 420px);
    min-height: 58px;
  }

  .app-header__menu {
    width: 34px;
    height: 34px;
  }

  .app-header__login {
    height: 34px;
    padding-inline: 12px;
    font-size: 0.72rem;
  }
}

@media (min-width: 900px) {
  .app-header--simple .app-header__nav {
    display: flex;
  }
}
</style>
