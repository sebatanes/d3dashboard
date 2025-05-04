<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

const settings = ref({
  notifications: true,
  autoRefresh: false,
  refreshInterval: 5,
  showTotals: true,
  currency: 'USD'
})

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' }
]

const saveSettings = () => {
  localStorage.setItem('dashboardSettings', JSON.stringify(settings.value))
  alert('Settings saved!')
}

const loadSettings = () => {
  const savedSettings = localStorage.getItem('dashboardSettings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="settings-container">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title mb-4">Settings</h5>
        
        <form @submit.prevent="saveSettings">
          <div class="row mb-4">
            <div class="col-md-3">
              <h6>Appearance</h6>
              <p class="text-muted small">Customize the dashboard appearance</p>
            </div>
            <div class="col-md-9">
              <div class="card settings-card">
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label d-block">Theme</label>
                    <div class="btn-group" role="group">
                      <button 
                        type="button" 
                        class="btn" 
                        :class="themeStore.currentTheme === 'light' ? 'btn-primary' : 'btn-outline-primary'"
                        @click="themeStore.setTheme('light')"
                      >
                        <i class="bi bi-sun me-2"></i>
                        Light
                      </button>
                      <button 
                        type="button" 
                        class="btn" 
                        :class="themeStore.currentTheme === 'dark' ? 'btn-primary' : 'btn-outline-primary'"
                        @click="themeStore.setTheme('dark')"
                      >
                        <i class="bi bi-moon me-2"></i>
                        Dark
                      </button>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="currency" class="form-label">Currency</label>
                    <select id="currency" v-model="settings.currency" class="form-select">
                      <option v-for="currency in currencies" :key="currency.value" :value="currency.value">
                        {{ currency.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row mb-4">
            <div class="col-md-3">
              <h6>Data Preferences</h6>
              <p class="text-muted small">Configure how data is displayed and refreshed</p>
            </div>
            <div class="col-md-9">
              <div class="card settings-card">
                <div class="card-body">
                  <div class="mb-3 form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="showTotals" v-model="settings.showTotals">
                    <label class="form-check-label" for="showTotals">Show totals on all charts</label>
                  </div>
                  
                  <div class="mb-3 form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="autoRefresh" v-model="settings.autoRefresh">
                    <label class="form-check-label" for="autoRefresh">Auto-refresh data</label>
                  </div>
                  
                  <div class="mb-3" v-if="settings.autoRefresh">
                    <label for="refreshInterval" class="form-label">Refresh interval (minutes)</label>
                    <select id="refreshInterval" v-model="settings.refreshInterval" class="form-select">
                      <option value="1">1 minute</option>
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row mb-4">
            <div class="col-md-3">
              <h6>Notifications</h6>
              <p class="text-muted small">Configure alerts and notifications</p>
            </div>
            <div class="col-md-9">
              <div class="card settings-card">
                <div class="card-body">
                  <div class="mb-3 form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="notifications" v-model="settings.notifications">
                    <label class="form-check-label" for="notifications">Enable dashboard notifications</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-9 offset-md-3">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save me-2"></i>
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-container {
  h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .settings-card {
    background-color: rgba(var(--primary-rgb), 0.03);
    border: 1px solid rgba(var(--primary-rgb), 0.1);
    
    .form-check-input:checked {
      background-color: var(--primary);
      border-color: var(--primary);
    }
  }
}
</style>