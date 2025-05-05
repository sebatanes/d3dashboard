<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: 'Some User',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
})

const dropdownOpen = ref(false)
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleSignOut = () => {
  alert('Auth not implemented')
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      
      <div class="header-right">
        <div class="user-menu" @click="toggleDropdown" @blur="dropdownOpen = false">
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
          </div>
          <div class="avatar">
            <img :src="user.avatar" alt="User avatar">
          </div>
          
          <div class="dropdown-menu" :class="{ show: dropdownOpen }">
            <router-link to="/reports" class="dropdown-item">
              <i class="bi bi-file-earmark-text"></i>
              <span>Reports</span>
            </router-link>
            <router-link to="/settings" class="dropdown-item">
              <i class="bi bi-gear"></i>
              <span>Settings</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" @click="handleSignOut">
              <i class="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as vars;

.app-header {
  background-color: var(--sidebar-bg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: vars.$space-2 vars.$space-3;
  color: var(--header-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  .header-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    
    .page-title {
      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      margin-left: auto;
      
      .user-menu {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: vars.$space-1;
        border-radius: vars.$border-radius;
        transition: background-color 0.2s ease;
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .user-info {
          margin-right: vars.$space-1;
          
          .user-name {
            font-weight: 500;
          }
        }
        
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: vars.$border-radius;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          display: none;
          z-index: vars.$z-index-dropdown;
          
          &.show {
            display: block;
          }
          
          .dropdown-item {
            padding: vars.$space-1 vars.$space-2;
            display: flex;
            align-items: center;
            color: var(--body-color);
            transition: background-color 0.2s ease;
            
            i {
              margin-right: vars.$space-1;
              width: 16px;
            }
            
            &:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }
          }
          
          .dropdown-divider {
            height: 1px;
            background-color: var(--border-color);
            margin: vars.$space-1 0;
          }
        }
      }
    }
  }
}
</style>