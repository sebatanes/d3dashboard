import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AnalyticsData, FilterOptions, DateRange } from '../types'
import { generateMockData } from '../data/mockData'

export const useAnalyticsStore = defineStore('analytics', () => {
  const rawData = ref<AnalyticsData[]>(generateMockData())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const filters = ref<FilterOptions>({
    dateRange: {
      start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      end: new Date().toISOString()
    },
    categories: [],
    departments: []
  })
  
  const filteredData = computed(() => {
    return rawData.value.filter(item => {
      const itemDate = new Date(item.timestamp)
      const startDate = filters.value.dateRange.start ? new Date(filters.value.dateRange.start) : null
      const endDate = filters.value.dateRange.end ? new Date(filters.value.dateRange.end) : null
      
      if (startDate && itemDate < startDate) return false
      if (endDate && itemDate > endDate) return false
      
      if (filters.value.categories.length > 0 && !filters.value.categories.includes(item.category)) {
        return false
      }
      
      if (filters.value.departments.length > 0 && !filters.value.departments.includes(item.department)) {
        return false
      }
      
      return true
    })
  })
  
  const uniqueCategories = computed(() => {
    const categories = new Set<string>()
    rawData.value.forEach(item => categories.add(item.category))
    return Array.from(categories)
  })
  
  const uniqueDepartments = computed(() => {
    const departments = new Set<string>()
    rawData.value.forEach(item => departments.add(item.department))
    return Array.from(departments)
  })
  
  const totalRevenue = computed(() => {
    return filteredData.value.reduce((total, item) => total + item.revenue, 0)
  })
  
  const revenueByCategory = computed(() => {
    const result: Record<string, number> = {}
    
    filteredData.value.forEach(item => {
      if (!result[item.category]) {
        result[item.category] = 0
      }
      result[item.category] += item.revenue
    })
    
    return result
  })
  
  const revenueByMonth = computed(() => {
    const result: Record<string, number> = {}
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    
    monthNames.forEach(month => {
      result[month] = 0
    })
    
    filteredData.value.forEach(item => {
      const date = new Date(item.timestamp)
      const month = monthNames[date.getMonth()]
      result[month] += item.revenue
    })
    
    return result
  })
  
  const updateDashboardFilters = (newFilters: Partial<FilterOptions>) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  const changeDateRange = (range: DateRange) => {
    filters.value.dateRange = range
  }
  
  const reloadDashboardData = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      rawData.value = generateMockData()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loadin data'
    } finally {
      isLoading.value = false
    }
  }
  
  const exportSalesToCSV = () => {
    const headers = ['Date', 'Revenue', 'Category', 'Department', 'Quantity']
    const rows = filteredData.value.map(item => [
      item.timestamp,
      item.revenue.toString(),
      item.category,
      item.department,
      item.quantity.toString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  async function refreshData() {
    await reloadDashboardData();
  }
  
  return {
    rawData,
    filteredData,
    isLoading,
    error,
    filters,
    uniqueCategories,
    uniqueDepartments,
    totalRevenue,
    revenueByCategory,
    revenueByMonth,
    updateDashboardFilters,
    changeDateRange,
    reloadDashboardData,
    exportSalesToCSV,
    refreshData,
  }
})