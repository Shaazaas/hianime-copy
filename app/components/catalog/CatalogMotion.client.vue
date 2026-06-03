<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.catalog-motion-card').forEach((card) => {
      gsap.fromTo(card, {
        opacity: 0.82,
        y: 18,
        scale: 0.985
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.58,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          end: 'bottom 18%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    gsap.utils.toArray<HTMLElement>('.catalog-motion-image').forEach((image) => {
      gsap.fromTo(image, {
        scale: 0.96,
        opacity: 0.74
      }, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: image,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7
        }
      })
    })
  })

})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <span aria-hidden="true" class="hidden" />
</template>
