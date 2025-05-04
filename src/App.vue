<script setup lang="ts">
import { computed, watch } from 'vue'
import { useThemeStore } from './stores/theme'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'

const themeStore = useThemeStore()
const currentTheme = computed(() => themeStore.currentTheme)

// Update body class when theme changes
watch(
  () => currentTheme.value,
  (newTheme) => {
    document.body.classList.remove('theme-light', 'theme-dark')
    document.body.classList.add(`theme-${newTheme}`)
  },
  { immediate: true }
)
</script>

<template>
  <div class="app-container" :class="`theme-${currentTheme}`">
    <Sidebar />
    <div class="main-content">
      <Header />
      <main class="content-wrapper">
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>

<style lang="scss">
.app-container {
  display: flex;
  min-height: 100vh;
  transition: background-color 0.3s ease;

  &.theme-light {
    background-color: #f8f9fa;
    color: #212529;
  }

  &.theme-dark {
    background-color: #212529;
    color: #f8f9fa;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin-left: 250px;
    width: calc(100% - 250px);
    transition: margin-left 0.3s ease, width 0.3s ease;

    .content-wrapper {
      flex: 1;
      padding: 1.5rem;
    }
  }
}
</style>