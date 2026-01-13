import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  // Enregistrer les plugins GSAP
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)
  }

  return {
    provide: {
      gsap,
      ScrollTrigger
    }
  }
})