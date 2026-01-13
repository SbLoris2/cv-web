<template>
  <div class="container mx-auto px-6 py-20 min-h-screen flex items-center justify-center">
    <div class="max-w-4xl w-full">
      
      <!-- Hero Section -->
      <div class="text-center space-y-8 backdrop-blur-md rounded-3xl p-12"
           :class="isDark ? 'bg-dark-bg-secondary/50' : 'bg-white/50'">
        
        <!-- Photo -->
        <div class="flex justify-center">
          <div class="w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/30">
            <img src="/profile.jpg" alt="Loris Lebreton" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Nom -->
        <div>
          <h1 class="text-6xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Loris Lebreton
          </h1>
          <p class="text-2xl font-light" :class="isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            Développeur Full-Stack
          </p>
        </div>

        <!-- Description courte -->
        <p class="text-lg max-w-2xl mx-auto leading-relaxed" 
           :class="isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
          Passionné par le développement web moderne, je crée des applications performantes 
          avec Vue.js, TypeScript et Spring Boot.
        </p>

        <!-- CTA Buttons -->
        <div class="flex gap-4 justify-center flex-wrap">
          <NuxtLink 
            to="/experiences"
            class="px-8 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Voir mes expériences
          </NuxtLink>
          
          <a 
            href="mailto:loris.lebreton@hotmail.com"
            class="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium transition-all duration-300 hover:scale-105"
          >
            Me contacter
          </a>
        </div>

        <!-- Quick Links -->
        <div class="flex gap-6 justify-center pt-8">
          <a href="https://github.com/loris-lebreton" target="_blank" 
             class="p-3 rounded-full transition-all duration-300 hover:scale-110"
             :class="isDark ? 'hover:bg-dark-bg-secondary' : 'hover:bg-light-bg-secondary'">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
          <a href="https://linkedin.com/in/loris-lebreton" target="_blank"
             class="p-3 rounded-full transition-all duration-300 hover:scale-110"
             :class="isDark ? 'hover:bg-dark-bg-secondary' : 'hover:bg-light-bg-secondary'">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark()

useHead({
  title: 'Loris Lebreton - Développeur Full-Stack',
  meta: [
    { name: 'description', content: 'Portfolio de Loris Lebreton, développeur full-stack spécialisé en Vue.js, TypeScript et Spring Boot.' }
  ]
})
</script>