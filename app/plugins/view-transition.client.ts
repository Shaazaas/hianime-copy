export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:view-transition:start', (transition) => {
    const { clearAnimeViewTransition } = useAnimeViewTransition()

    transition.finished.finally(() => {
      clearAnimeViewTransition()
    })
  })
})
