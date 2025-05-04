import { AnalyticsData } from '../types'

const categories = [
  'Electronics', 
  'Clothing', 
  'Home & Garden', 
  'Sports', 
  'Beauty'
]

// Regiones de venta - ajustadas según nuestro mercado
const departments = [
  'North America', 
  'Europe', 
  'Asia Pacific', 
  'Latin America'
]

// Genera datos de prueba para el dashboard
// TODO: Considerar agregar más categorías en el futuro
export const generateMockData = (count = 500): AnalyticsData[] => {
  const salesData: AnalyticsData[] = []
  
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setFullYear(endDate.getFullYear() - 1)
  
  for (let i = 0; i < count; i++) {
    const saleDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    ).toISOString()
    
    const productCategory = categories[Math.floor(Math.random() * categories.length)]
    const salesRegion = departments[Math.floor(Math.random() * departments.length)]
    
    const itemsSold = Math.floor(Math.random() * 100) + 1
    
    // Precios base por categoría - ajustados según nuestro histórico
    let pricePerUnit = 0
    switch (productCategory) {
      case 'Electronics':
        pricePerUnit = 200 + Math.random() * 800
        break
      case 'Clothing':
        pricePerUnit = 30 + Math.random() * 70
        break
      case 'Home & Garden':
        pricePerUnit = 50 + Math.random() * 200
        break
      case 'Sports':
        pricePerUnit = 40 + Math.random() * 160
        break
      case 'Beauty':
        pricePerUnit = 20 + Math.random() * 80
        break
      default:
        pricePerUnit = 50 + Math.random() * 150
    }
    
    const totalSale = Number((pricePerUnit * itemsSold).toFixed(2))
    
    salesData.push({
      timestamp: saleDate,
      revenue: totalSale,
      category: productCategory,
      department: salesRegion,
      quantity: itemsSold
    })
  }
  
  return salesData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export const MOCK_DATA = generateMockData()