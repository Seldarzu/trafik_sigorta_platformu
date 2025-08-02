export type Page =
  | 'dashboard'
  | 'new-quote'
  | 'quotes'
  | 'customers'
  | 'analytics'
  | 'settings'
  | 'policies';

export interface Vehicle {
  plateNumber: string
  brand: string
  model: string
  year: number
  engineSize?: string
  fuelType?: 'gasoline' | 'diesel' | 'lpg' | 'electric' | 'hybrid'
  usage?: 'personal' | 'commercial' | 'taxi' | 'truck'
  cityCode?: string
}

export interface Driver {
  firstName: string
  lastName: string
  tcNumber: string
  birthDate: string
  licenseDate?: string
  gender?: 'male' | 'female'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  education?: 'primary' | 'secondary' | 'high_school' | 'university' | 'postgraduate'
  profession?: string
  hasAccidents?: boolean
  accidentCount?: number
  hasViolations?: boolean
  violationCount?: number
}

export interface QuoteFormData {
  vehicle: Partial<Vehicle>
  driver: Partial<Driver>
  currentStep: 1 | 2 | 3
}

export interface Quote {
  id: string
  uniqueRefNo: string
  customerId?: string
  riskScore: number
  premiumAmount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export interface OverviewData {
  totalRevenue: number
  totalPolicies: number
  conversionRate: number
  averagePremium: number
}

export interface MonthlyData {
  month: string
  revenue: number
  policies: number
  quotes: number
}

export interface RiskDistribution {
  level: string
  count: number
  percentage: number
  color: string
}

export interface BrandData {
  brand: string
  count: number
  revenue: number
}

export interface SegmentData {
  segment: string
  count: number
  value: number
  color: string
}

export interface PerformanceMetric {
  metric: string
  current: number
  previous: number
  target: number
  unit: string
}

export interface AnalyticsData {
  totalRevenue: number
  totalPolicies: number
  conversionRate: number
  averagePremium: number
  monthlyData: MonthlyData[]
  riskDistribution: RiskDistribution[]
  topVehicleBrands: BrandData[]
  customerSegments: SegmentData[]
  performanceMetrics: PerformanceMetric[]
}

export interface CreateVehicleDto {
  plateNumber: string
  brand: string
  model: string
  year: number
  engineSize: string
  fuelType: Vehicle['fuelType']
  usage: Vehicle['usage']
  cityCode: string
}

export interface CreateDriverDto {
  firstName: string
  lastName: string
  tcNumber: string
  birthDate: string
  licenseDate?: string
  gender?: string
  maritalStatus?: string
  education?: string
  profession?: string
  hasAccidents: boolean
  accidentCount?: number
  hasViolations: boolean
  violationCount?: number
}

export interface CreateQuoteDto {
  customerId: string
  riskScore: number
  premiumAmount: number
  vehicle: CreateVehicleDto
  driver: CreateDriverDto
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
}

export interface FilterOptions {
  status: string
  minPremium: number
  maxPremium: number
  sortBy: 'createdAt' | 'premiumAmount' | 'riskScore'
  sortOrder: 'asc' | 'desc'
}
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  tcNumber: string
  birthDate: string
  address: string
  city: string
  registrationDate: string
  totalPolicies: number
  totalPremium: number
  lastPolicyDate: string
  status: 'active' | 'inactive' | 'potential'
  riskProfile: 'low' | 'medium' | 'high'
  customerValue: 'bronze' | 'silver' | 'gold' | 'platinum'
  notes: string
}

export interface CreateCustomerDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  tcNumber: string
  birthDate: string
  address?: string
  city?: string
  status: 'potential' | 'active' | 'inactive'
  riskProfile: 'low' | 'medium' | 'high'
  customerValue: 'bronze' | 'silver' | 'gold' | 'platinum'
  notes?: string
}
