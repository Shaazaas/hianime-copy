<script setup lang="ts">
defineProps<{
  title: string
  to?: string
}>()
</script>

<template>
  <div class="section-header">
    <h2>{{ title }}</h2>
    <NuxtLink v-if="to" :to="to">View More</NuxtLink>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h2 {
  color: hsl(var(--primary));
  font-size: 1.45rem;
  font-weight: 800;
}

.section-header a {
  color: hsl(var(--muted-foreground));
  font-size: 0.78rem;
  font-weight: 600;
}
</style>
