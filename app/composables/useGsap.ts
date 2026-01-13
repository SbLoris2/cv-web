import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useGsap = () => {
  // Cleanup des animations au unmount
  const cleanupAnimations = (animations: gsap.core.Tween[]) => {
    onBeforeUnmount(() => {
      animations.forEach(anim => anim.kill())
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    })
  }

  return {
    gsap,
    ScrollTrigger,
    cleanupAnimations
  }
}