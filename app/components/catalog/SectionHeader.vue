<script setup lang="ts">
defineProps<{
  title: string
  to?: string
}>()
</script>

<template>
  <div class="mb-6 flex items-center justify-between gap-4 max-[620px]:mb-4">
    <h2 class="text-[22px] font-semibold leading-[1.3] text-[#ffbade] max-[620px]:text-xl">{{ title }}</h2>
    <div>
      <UButton v-if="to" :to="to" color="neutral" variant="link" size="sm" trailing-icon="i-lucide-chevron-right" class="px-0 text-xs font-normal text-[#aaa] hover:text-[#ffbade]">
        View More
      </UButton>
    </div>
  </div>
</template>
