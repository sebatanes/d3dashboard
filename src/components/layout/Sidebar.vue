<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores/theme'

const route = useRoute()
const themeStore = useThemeStore()
const currentTheme = computed(() => themeStore.currentTheme)

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: 'bi-grid-1x2' },
  { name: 'Reports', path: '/reports', icon: 'bi-bar-chart' },
  { name: 'Settings', path: '/settings', icon: 'bi-gear' }
]

const isActive = (path: string): boolean => {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': false }">
    <div class="sidebar-header">
      <div class="logo">
        <i class="bi bi-bar-chart-fill me-2"></i>
        <span>Analytics</span>
      </div>
    </div>
    
    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in navigationItems" :key="item.name">
            <router-link 
              :to="item.path" 
              :class="{ active: isActive(item.path) }"
            >
              <i :class="`bi ${item.icon}`"></i>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    
    <div class="sidebar-footer">
      <button 
        class="theme-toggle"
        @click="themeStore.toggleTheme()"
        :title="`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`"
      >
        <i :class="`bi ${currentTheme === 'light' ? 'bi-moon' : 'bi-sun'}`"></i>
        <span>{{ currentTheme === 'light' ? 'Dark Mode' : 'Light Mode' }}</span>
      </button>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as vars;
@use '../../assets/styles/mixins' as mix;

.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--sidebar-bg);
  color: var(--sidebar-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, background-color 0.3s ease;
  z-index: 1000;
  
  @include mix.respond-below(md) {
    width: 0;
    overflow: hidden;
    
    &.sidebar-open {
      width: 250px;
    }
  }
  
  .sidebar-header {
    padding: vars.$space-2 vars.$space-3;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    height: 85px;
    display: flex;
    align-items: center;
    
    .logo {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
      font-weight: 700;
      
      i {
        font-size: 1.5rem;
        color: var(--primary);
      }
    }
  }
  
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    
    .sidebar-nav {
      ul {
        list-style: none;
        padding: 0;
        margin: vars.$space-2 0;
        
        li {
          margin-bottom: 0.25rem;
          
          a {
            display: flex;
            align-items: center;
            padding: vars.$space-1 vars.$space-2;
            color: var(--sidebar-color);
            text-decoration: none;
            transition: background-color 0.2s ease;
            border-radius: 4px;
            margin: 0 vars.$space-1;
            
            i {
              margin-right: vars.$space-1;
              font-size: 1.1rem;
              width: 24px;
              text-align: center;
            }
            
            &:hover {
              background-color: var(--sidebar-hover);
            }
            
            &.active {
              background-color: rgba(var(--primary-rgb), 0.2);
              color: var(--sidebar-active);
              font-weight: 500;
            }
          }
        }
      }
    }
  }
  
  .sidebar-footer {
    padding: vars.$space-2;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    .theme-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: vars.$border-radius;
      padding: vars.$space-1;
      color: var(--sidebar-color);
      cursor: pointer;
      transition: background-color 0.2s ease;
      
      i {
        margin-right: vars.$space-1;
      }
      
      &:hover {
        background-color: var(--sidebar-hover);
      }
    }
  }
}
</style>