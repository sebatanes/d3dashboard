export interface AnalyticsData {
  timestamp: string;
  revenue: number;
  category: string;
  department: string;
  quantity: number;
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface FilterOptions {
  dateRange: DateRange;
  categories: string[];
  departments: string[];
}

export type ChartType = 'line' | 'bar' | 'pie';

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

export interface ChartOptions {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string[];
  animate?: boolean;
  height?: number;
}

export type ThemeType = 'light' | 'dark';