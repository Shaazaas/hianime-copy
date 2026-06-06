<script setup lang="ts">
import BrandLogo from './BrandLogo.vue'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
</script>

<template>
  <footer id="footer" class="mt-16 bg-[#201f31] text-white">
    <div class="mx-auto w-full max-w-[1800px] px-[15px] pb-10">
      <div class="flex flex-wrap items-center gap-8 border-t border-white/10 pt-8">
        <BrandLogo />
        <div class="flex items-center gap-2 text-sm">
          <span class="text-white/50">Join now</span>
          <span class="inline-flex size-8 items-center justify-center rounded-full bg-[#6f85d5]"><UIcon name="i-lucide-message-circle" class="size-4" /></span>
          <span class="inline-flex size-8 items-center justify-center rounded-full bg-[#08c]"><UIcon name="i-lucide-send" class="size-4" /></span>
          <span class="inline-flex size-8 items-center justify-center rounded-full bg-[#ff3c1f]"><UIcon name="i-lucide-badge-alert" class="size-4" /></span>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="mb-3 text-xl font-semibold text-[#ffbade]">A-Z List</h2>
        <div class="flex flex-wrap gap-1.5">
          <ULink raw to="/filter" class="rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-[#ffbade] hover:text-[#111]">All</ULink>
          <ULink v-for="letter in letters" :key="letter" raw :to="`/filter?search=${letter}`" class="rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-[#ffbade] hover:text-[#111]">
            {{ letter }}
          </ULink>
        </div>
      </div>

      <p class="mt-8 max-w-[900px] text-xs leading-relaxed text-white/45">
        HiAnime links only to AniList metadata. No media files are stored or streamed by this app.
      </p>

      <div class="mt-6 flex flex-wrap gap-4 text-xs text-white/60">
        <ULink raw to="/home" class="hover:text-[#ffbade]">Home</ULink>
        <ULink raw to="/filter" class="hover:text-[#ffbade]">Filter</ULink>
        <ULink raw to="/most-popular" class="hover:text-[#ffbade]">Most Popular</ULink>
        <small>© HiAnime. All rights reserved.</small>
      </div>
    </div>
  </footer>
</template>
