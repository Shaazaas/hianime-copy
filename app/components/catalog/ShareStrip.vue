<script setup lang="ts">
import { Send, Share2, X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="share-strip">
    <div class="share-strip__mascot">h!</div>
    <div>
      <strong>Share HiAnime</strong>
      <span>to your friends</span>
    </div>
    <b>520K <small>shares</small></b>
    <Button size="sm"><ClientOnly><Share2 data-icon="inline-start" /></ClientOnly>Share</Button>
    <Button size="sm" variant="secondary"><ClientOnly><X data-icon="inline-start" /></ClientOnly>Share</Button>
    <Button size="sm"><ClientOnly><Send data-icon="inline-start" /></ClientOnly>Share</Button>
  </div>
</template>

<style scoped>
.share-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  color: hsl(var(--foreground));
}

.share-strip__mascot {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 999px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-weight: 900;
}

.share-strip strong,
.share-strip span,
.share-strip small {
  display: block;
}

.share-strip strong {
  color: hsl(var(--primary));
  text-transform: uppercase;
}

.share-strip span,
.share-strip small {
  color: hsl(var(--muted-foreground));
  font-size: 0.72rem;
}

.share-strip b {
  color: hsl(var(--muted-foreground));
  font-size: 1.2rem;
}
</style>
