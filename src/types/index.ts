// Data structure as defined in requirements
export interface AnalyticsData {
  timestamp: string;
  revenue: number;
  category: string;
  department: string;
  quantity: number;
}

// Filter options
export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface FilterOptions {
  dateRange: DateRange;
  categories: string[];
  departments: string[];
}

// Chart types
export type ChartType = 'line' | 'bar' | 'pie';

// Chart data interfaces
export interface LineChartData {
  x: string;
  y: number;
}

export interface PieChartData {
  label: string;
  value: number;
}

export interface BarChartData {
  label: string;
  value: number;
}

// Chart options
export interface ChartOptions {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string[];
  animate?: boolean;
  height?: number;
}

// Theme type
export type ThemeType = 'light' | 'dark';