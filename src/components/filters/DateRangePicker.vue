<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DateRange } from '../../types'

const props = withDefaults(defineProps<{
  dateRange: DateRange;
}>(), {
  dateRange: () => ({ start: null, end: null })
})

const emit = defineEmits<{
  (e: 'update:dateRange', range: DateRange): void;
}>()

const startDate = ref(props.dateRange.start ? new Date(props.dateRange.start).toISOString().split('T')[0] : '')
const endDate = ref(props.dateRange.end ? new Date(props.dateRange.end).toISOString().split('T')[0] : '')

const today = computed(() => new Date().toISOString().split('T')[0])

watch(() => props.dateRange, (newRange) => {
  startDate.value = newRange.start ? new Date(newRange.start).toISOString().split('T')[0] : ''
  endDate.value = newRange.end ? new Date(newRange.end).toISOString().split('T')[0] : ''
}, { deep: true })

let debounceTimer: number | null = null
const updateDateRange = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = window.setTimeout(() => {
    emit('update:dateRange', {
      start: startDate.value ? new Date(startDate.value).toISOString() : null,
      end: endDate.value ? new Date(endDate.value).toISOString() : null
    })
  }, 300)
}

const handleStartDateChange = (e: Event) => {
  startDate.value = (e.target as HTMLInputElement).value
  updateDateRange()
}

const handleEndDateChange = (e: Event) => {
  endDate.value = (e.target as HTMLInputElement).value
  updateDateRange()
}

const applyPreset = (preset: string) => {
  const now = new Date()
  const endDate = new Date()
  let startDate = new Date()
  
  switch (preset) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'yesterday':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      endDate.setDate(now.getDate() - 1)
      break
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      break
    case 'quarter':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      break
    case 'year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      break
    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      return
  }
  
  emit('update:dateRange', {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  })
}
</script>

<template>
  <div class="date-range-picker">
    <div class="date-inputs">
      <div class="form-group">
        <label for="start-date">Start Date</label>
        <div class="input-group date">
          <input
            type="date"
            id="start-date"
            class="form-control"
            :max="today"
            :value="startDate"
            @input="handleStartDateChange"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="end-date">End Date</label>
        <div class="input-group date">
          <input
            type="date"
            id="end-date"
            class="form-control"
            :max="today"
            :min="startDate"
            :value="endDate"
            @input="handleEndDateChange"
          />
        </div>
      </div>
    </div>
    
    <div class="date-presets">
      <button 
        v-for="(label, preset) in { 
          today: 'Today', 
          yesterday: 'Yesterday', 
          week: 'Last 7 Days', 
          month: 'Last 30 Days', 
          quarter: 'Last 90 Days', 
          year: 'Last Year',
          ytd: 'Year to Date'
        }" 
        :key="preset" 
        class="btn btn-sm btn-outline-primary me-2 mb-2"
        @click="applyPreset(preset)"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.date-range-picker {
  .date-inputs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    
    @include respond-below(sm) {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-group {
      flex: 1;
      
      label {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
        color: var(--body-color);
      }
      
      .input-group {
        .form-control {
          width: 100%;
          background-color: var(--input-bg);
          color: var(--input-color) !important;
          border-color: var(--input-border);
          
          &:focus {
            border-color: var(--input-focus-border);
            box-shadow: 0 0 0 0.25rem rgba(var(--primary-rgb), 0.25);
          }
        }
        
        .input-group-text {
          background-color: var(--input-bg);
          border-color: var(--input-border);
          color: var(--body-color);
          cursor: pointer;
          
          &:hover {
            background-color: var(--input-focus-bg);
          }
        }
      }
    }
  }
  
  .date-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    
    .btn-outline-primary {
      border-color: var(--input-border);
      color: var(--body-color);
      
      &:hover {
        background-color: var(--primary);
        border-color: var(--primary);
        color: white;
      }
    }
  }
}

input[type='date'] {
  color: var(--input-color) !important;
}

input[type='date']::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: var(--input-color) !important;
  opacity: 1;
}
input[type='date']::-moz-placeholder { /* Firefox 19+ */
  color: var(--input-color) !important;
  opacity: 1;
}
input[type='date']:-ms-input-placeholder { /* IE 10+ */
  color: var(--input-color) !important;
  opacity: 1;
}
input[type='date']::placeholder { /* Modern browsers */
  color: var(--input-color) !important;
  opacity: 1;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

/* Para Firefox */
input[type="date"]::-moz-calendar-picker-indicator {
  filter: invert(1);
}

input[type="date"]::-webkit-clear-button,
input[type="date"]::-webkit-inner-spin-button {
  display: none;
}

input[type="date"]::-ms-reveal {
  display: none;
}
</style>