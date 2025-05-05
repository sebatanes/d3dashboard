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
  analyticsStore.exportSalesToCSV()
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
  .card {
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    border: none;
    background: linear-gradient(120deg, #f7fafd 0%, #e3f0ff 100%);
  }

  .table {
    color: var(--body-color);
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 12px rgba(79,140,255,0.08);
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 0;

    thead {
      background: #fff;
      th {
        color: #22314a;
        font-weight: 800;
        font-size: 1.13rem;
        border-bottom: 2px solid #e3f0ff;
        letter-spacing: 0.03em;
        padding: 18px 16px;
        text-shadow: none;
      }
    }

    tbody {
      tr {
        transition: background 0.25s, box-shadow 0.25s;
        border-radius: 12px;
        box-shadow: none;
        &:nth-child(even) {
          background: #f4f8ff;
        }
        &:hover {
          background: #e3f0ff;
          box-shadow: 0 2px 8px rgba(79,140,255,0.10);
        }
      }
      td {
        padding: 16px 16px;
        vertical-align: middle;
        font-size: 1.07rem;
        border-top: 1.5px solid #e9eef7;
        border-bottom: none;
        background: transparent;
      }
      tr:first-child td {
        border-top: none;
      }
    }
  }

  .pagination {
    .page-link {
      color: var(--primary);
      font-weight: 600;
      border-radius: 8px;
      margin: 0 2px;
      font-size: 1.08rem;
      min-width: 40px;
      text-align: center;
      border: none;
      background: #f4f8ff;
      transition: background 0.2s, color 0.2s;
      &:hover {
        background: #e3f0ff;
        color: #4f8cff;
      }
    }
    .page-item.active .page-link {
      background: linear-gradient(90deg, #4f8cff 0%, #6fc3ff 100%);
      border: none;
      color: #fff;
      box-shadow: 0 2px 8px rgba(79,140,255,0.10);
    }
  }

  .alert-info {
    border-radius: 12px;
    font-size: 1.13rem;
    background: linear-gradient(90deg, #e3f0ff 0%, #f7fafd 100%);
    color: #2b4a6f;
    border: none;
    box-shadow: 0 2px 8px rgba(79,140,255,0.07);
  }

  .input-group-text {
    background: #fff;
    border: 1.5px solid #e3f0ff;
    color: #4f8cff;
    font-weight: 700;
  }

  .form-control, .form-select {
    border-radius: 8px;
    border: 1.5px solid #e3f0ff;
    background: #fff;
    font-size: 1.05rem;
    color: #22314a;
    transition: border 0.2s;
    &:focus {
      border-color: #4f8cff;
      box-shadow: 0 0 0 2px #e3f0ff;
    }
  }
}
</style>