<script setup lang="ts">
import BrandLogo from './BrandLogo.vue'
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <BrandLogo />
      <p>HiAnime links only to AniList metadata. No media files are stored or streamed by this app.</p>
      <small>© HiAnime. All rights reserved.</small>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 80px;
  border-top: 1px solid hsl(var(--border));
}

.app-footer__inner {
  width: min(1460px, calc(100% - 48px));
  margin: 0 auto;
  padding: 34px 0;
  color: hsl(var(--muted-foreground));
}

.app-footer__inner p {
  margin-top: 20px;
}

.app-footer__inner small {
  display: block;
  margin-top: 8px;
  font-weight: 700;
}
</style>
