import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
    return savedTheme as Theme
  }
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>(getInitialTheme())
  
  watch(currentTheme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    
    document.body.classList.remove('theme-light', 'theme-dark')
    document.body.classList.add(`theme-${newTheme}`)
  })
  
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  }
  
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
  }
  
  return {
    currentTheme,
    toggleTheme,
    setTheme
  }
})