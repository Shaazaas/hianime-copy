<template>
  <NuxtLink to="/" class="brand-logo" aria-label="h!anime home">
    <span class="brand-logo__mark">h<span>!</span></span><span>anime</span>
  </NuxtLink>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  color: hsl(var(--foreground));
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1;
}

.brand-logo__mark span {
  color: hsl(var(--primary));
}

@media (max-width: 420px) {
  .brand-logo {
    font-size: 1.62rem;
  }
}
</style>
