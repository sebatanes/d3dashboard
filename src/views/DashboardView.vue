<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '../stores/analytics'
import LineChart from '../components/charts/LineChart.vue'
import PieChart from '../components/charts/PieChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import DateRangePicker from '../components/filters/DateRangePicker.vue'
import CategoryFilter from '../components/filters/CategoryFilter.vue'

const analyticsStore = useAnalyticsStore()
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

const revenueByMonthData = computed(() => {
  const data = analyticsStore.revenueByMonth
  return Object.keys(data).map(month => ({
    x: month,
    y: data[month]
  }))
})

const revenueByCategoryData = computed(() => {
  const data = analyticsStore.revenueByCategory
  return Object.keys(data).map(category => ({
    label: category,
    value: data[category]
  }))
})

const salesByDepartmentData = computed(() => {
  const departments: Record<string, number> = {}
  
  analyticsStore.filteredData.forEach(item => {
    if (!departments[item.department]) {
      departments[item.department] = 0
    }
    departments[item.department] += item.quantity
  })
  
  return Object.keys(departments).map(dept => ({
    label: dept,
    value: departments[dept]
  }))
})

const totalRevenue = computed(() => {
  return analyticsStore.totalRevenue.toLocaleString('en-US', {
    style: 'currency',
    currency: settings.value.currency,
    maximumFractionDigits: 0
  })
})

const averageOrderValue = computed(() => {
  const totalOrders = analyticsStore.filteredData.length
  if (totalOrders === 0) return '$0'
  
  const average = analyticsStore.totalRevenue / totalOrders
  return average.toLocaleString('en-US', {
    style: 'currency',
    currency: settings.value.currency,
    maximumFractionDigits: 0
  })
})

const totalOrders = computed(() => {
  return analyticsStore.filteredData.length.toLocaleString()
})

const totalItems = computed(() => {
  const items = analyticsStore.filteredData.reduce((sum, item) => sum + item.quantity, 0)
  return items.toLocaleString()
})

const isRefreshing = ref(false)
const refreshData = async () => {
  isRefreshing.value = true
  await analyticsStore.refreshData()
  isRefreshing.value = false
}

onMounted(() => {
  loadSettings()
  if (analyticsStore.filteredData.length === 0) {
    refreshData()
  }
})
</script>

<template>
  <div class="dashboard-container">
    <section class="filters-section">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3" style="color: var(--body-color)">Filters</h5>
          <div class="row">
            <div class="col-lg-6">
              <DateRangePicker 
                v-model:dateRange="analyticsStore.filters.dateRange"
              />
            </div>
            <div class="col-lg-6">
              <div class="row">
                <div class="col-md-6">
                  <CategoryFilter 
                    label="Categories" 
                    :options="analyticsStore.uniqueCategories"
                    v-model:selected="analyticsStore.filters.categories"
                  />
                </div>
                <div class="col-md-6">
                  <CategoryFilter 
                    label="Departments" 
                    :options="analyticsStore.uniqueDepartments"
                    v-model:selected="analyticsStore.filters.departments"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span style="color: var(--body-color)">
                Showing {{ analyticsStore.filteredData.length }} of {{ analyticsStore.rawData.length }} records
              </span>
            </div>
            <div class="actions">
              <button 
                class="btn btn-primary me-2" 
                @click="refreshData"
                :disabled="isRefreshing"
              >
                <i class="bi bi-arrow-clockwise me-1"></i>
                {{ isRefreshing ? 'Refreshing...' : 'Refresh Data' }}
              </button>
              <button 
                class="btn btn-outline-secondary" 
                @click="analyticsStore.exportSalesToCSV"
              >
                <i class="bi bi-download me-1"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="summary-section">
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Total Revenue</h6>
                  <h3 class="mb-0">{{ totalRevenue }}</h3>
                </div>
                <div class="summary-icon bg-primary-light text-primary">
                  <i class="bi bi-currency-dollar"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Avg. Order Value</h6>
                  <h3 class="mb-0">{{ averageOrderValue }}</h3>
                </div>
                <div class="summary-icon bg-success-light text-success">
                  <i class="bi bi-graph-up-arrow"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Total Orders</h6>
                  <h3 class="mb-0">{{ totalOrders }}</h3>
                </div>
                <div class="summary-icon bg-warning-light text-warning">
                  <i class="bi bi-cart-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Total Items</h6>
                  <h3 class="mb-0">{{ totalItems }}</h3>
                </div>
                <div class="summary-icon bg-info-light text-info">
                  <i class="bi bi-box-seam"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="charts-section">
      <div class="row">

        <div class="col-lg-8 mb-4">
          <LineChart 
            :data="revenueByMonthData" 
            title="Revenue Trend" 
            x-axis-label="Month" 
            y-axis-label="Revenue (USD)"
            :animate="true" 
            :height="350"
          />
        </div>
        
        <div class="col-lg-4 mb-4">
          <PieChart 
            :data="revenueByCategoryData" 
            title="Revenue by Category" 
            :animate="true"
            :height="350"
          />
        </div>
        
        <div class="col-md-12 mb-4">
          <BarChart 
            :data="salesByDepartmentData" 
            title="Sales by Department" 
            x-axis-label="Department" 
            y-axis-label="Units Sold"
            :animate="true"
            :height="300"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  .filters-section {
    margin-bottom: 2rem;
    
    .card {
      background-color: var(--card-bg) !important;
      border-color: var(--border-color);
      box-shadow: var(--card-shadow);
    }
  }
  
  .summary-section {
    margin-bottom: 2rem;
    
    .summary-card {
      height: 100%;
      background-color: var(--card-bg) !important;
      border-color: var(--border-color);
      box-shadow: var(--card-shadow);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
      
      .summary-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        
        &.bg-primary-light {
          background-color: rgba(var(--primary-rgb), 0.1);
        }
        
        &.bg-success-light {
          background-color: rgba(var(--success-rgb), 0.1);
        }
        
        &.bg-warning-light {
          background-color: rgba(var(--warning-rgb), 0.1);
        }
        
        &.bg-info-light {
          background-color: rgba(var(--info-rgb), 0.1);
        }
      }
    }
  }
  
  .charts-section {
    [class*="col-"] {
      > div {
        height: 100%;
        background-color: var(--card-bg) !important;
        border-color: var(--border-color);
        box-shadow: var(--card-shadow);
      }
    }
  }
}
</style>