<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  options: string[];
  selected: string[];
  label: string;
  useDefault?: boolean;
}>()

const emit = defineEmits<{
  (e: 'update:selected', selected: string[]): void;
}>()

const selectedOptions = ref<string[]>([...props.selected])
const allSelected = ref(props.options.length > 0 && selectedOptions.value.length === props.options.length)

watch(() => props.selected, (newSelected) => {
  selectedOptions.value = [...newSelected]
  updateAllSelected()
}, { deep: true })

const updateAllSelected = () => {
  allSelected.value = props.options.length > 0 && selectedOptions.value.length === props.options.length
}

const toggleOption = (option: string) => {
  const index = selectedOptions.value.indexOf(option)
  if (index === -1) {
    selectedOptions.value.push(option)
  } else {
    selectedOptions.value.splice(index, 1)
  }
  
  updateAllSelected()
  emitUpdate()
}

const toggleAll = () => {
  if (allSelected.value) {
    selectedOptions.value = []
  } else {
    selectedOptions.value = [...props.options]
  }
  
  allSelected.value = !allSelected.value
  emitUpdate()
}

let debounceTimer: number | null = null
const emitUpdate = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = window.setTimeout(() => {
    emit('update:selected', selectedOptions.value)
  }, 300)
}
</script>

<template>
  <div class="filter-container">
    <div class="filter-header">
      <h6>{{ label }}</h6>
      <div class="select-all">
        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="selectAll" 
            :checked="allSelected"
            @change="toggleAll"
          />
          <label class="form-check-label" for="selectAll">
            Select All
          </label>
        </div>
      </div>
    </div>
    
    <div class="options-list">
      <div v-for="option in options" :key="option" class="form-check">
        <input 
          class="form-check-input" 
          type="checkbox" 
          :id="`option-${option}`"
          :checked="selectedOptions.includes(option)"
          @change="toggleOption(option)"
        />
        <label class="form-check-label" :for="`option-${option}`">
          {{ option }}
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as vars;

.filter-container {
  background-color: var(--card-bg);
  border-radius: vars.$border-radius;
  box-shadow: var(--card-shadow);
  margin-bottom: 1rem;
  
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    
    h6 {
      margin: 0;
      font-weight: 600;
      font-size: 1rem;
    }
    
    .select-all {
      font-size: 0.95rem;
      display: flex;
      align-items: center;
    }
  }
  
  .options-list {
    max-height: 200px;
    overflow-y: auto;
    padding: 1rem 2.25rem;
    
    .form-check {
      display: flex;
      align-items: center;
      padding: 0.5rem 0;
      
      .form-check-input {
        cursor: pointer;
        margin-right: 0.5rem;
        margin-top: 0;
        
        &:checked {
          background-color: var(--primary);
          border-color: var(--primary);
        }
      }
      
      .form-check-label {
        cursor: pointer;
        margin-left: 0;
        font-size: 0.97rem;
      }
    }
  }
}
</style>