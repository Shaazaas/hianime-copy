export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  experimental: {
    viewTransition: true
  },
  vite: {
    optimizeDeps: {
      include: ['@vueuse/core', 'gsap', 'gsap/ScrollTrigger']
    }
  },
  app: {
    viewTransition: false
  },
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  css: ['~/assets/css/tailwind.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']
    }
  }
})
