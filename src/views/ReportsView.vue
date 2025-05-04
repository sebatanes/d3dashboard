<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAnalyticsStore } from '../stores/analytics'

const analyticsStore = useAnalyticsStore()
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const settings = ref({
  currency: 'USD'
})

const loadSettings = () => {
  const savedSettings = localStorage.getItem('dashboardSettings')
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings)
    settings.value.currency = parsedSettings.currency || 'USD'
  }
}

const filteredData = computed(() => {
  let data = analyticsStore.filteredData
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.department.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  return data
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredData.value.length / itemsPerPage.value)
)

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleExport = () => {
  analyticsStore.exportToCsv()
}

const handleRefresh = async () => {
  await analyticsStore.refreshData()
  currentPage.value = 1
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: settings.value.currency
  }).format(value)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="reports-container">
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="card-title mb-0">Detailed Reports</h5>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" @click="handleRefresh">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
            <button class="btn btn-outline-success" @click="handleExport">
              <i class="bi bi-download me-1"></i>Export CSV
            </button>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search by department or category..."
              >
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex justify-content-end gap-2">
              <select v-model="itemsPerPage" class="form-select" style="width: auto;">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="index">
                <td>{{ formatDate(item.timestamp) }}</td>
                <td>{{ item.department }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatCurrency(item.revenue) }}</td>
              </tr>
              <tr v-if="paginatedData.length === 0">
                <td colspan="5" class="text-center py-4">
                  <div class="text-muted">
                    <i class="bi bi-search me-2"></i>
                    No records found
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-4">
          <div class="text-muted">
            Showing {{ paginatedData.length }} of {{ filteredData.length }} records
          </div>
          <nav v-if="totalPages > 1">
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage - 1)">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="handlePageChange(page)">
                  {{ page }}
                </a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage + 1)">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="alert alert-info mt-4">
          <i class="bi bi-info-circle me-2"></i>
          Total Revenue: {{ formatCurrency(analyticsStore.totalRevenue) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reports-container {
  .table {
    color: var(--body-color);
    
    thead {
      background-color: rgba(var(--primary-rgb), 0.05);
      
      th {
        font-weight: 600;
        border-bottom-width: 1px;
      }
    }
    
    tbody {
      tr {
        transition: background-color 0.2s ease;
        
        &:hover {
          background-color: rgba(var(--primary-rgb), 0.05);
        }
      }
    }
  }

  .pagination {
    .page-link {
      color: var(--primary);
      
      &:hover {
        background-color: rgba(var(--primary-rgb), 0.1);
      }
    }
    
    .page-item.active .page-link {
      background-color: var(--primary);
      border-color: var(--primary);
    }
  }
}
</style>