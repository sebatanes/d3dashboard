<script setup lang="ts">
const appVersion = '1.0.0'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="copyright">
        &copy; {{ year }} Business Analytics Dashboard
      </div>
      <div class="version">
        Version {{ appVersion }}
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as vars;

.app-footer {
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: vars.$space-2 vars.$space-3;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: var(--gray-600);
    
    .copyright, .version {
      color: var(--body-color);
      opacity: 0.7;
    }
  }
}
</style>