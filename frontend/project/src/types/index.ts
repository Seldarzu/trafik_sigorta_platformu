
export interface Vehicle {
  id?: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  engineSize: string;
  fuelType: 'gasoline' | 'diesel' | 'lpg' | 'electric' | 'hybrid';
  usage: 'personal' | 'commercial' | 'taxi' | 'truck';
  cityCode: string;
}

export interface Driver {
  id?: string;
  firstName: string;
  lastName: string;
  tcNumber: string;
  birthDate: string;
  licenseDate: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  education: 'primary' | 'secondary' | 'high_school' | 'university' | 'postgraduate';
  profession: string;
  hasAccidents: boolean;
  accidentCount: number;
  hasViolations: boolean;
  violationCount: number;
}

export interface Discount {
  type: 'no_claim' | 'young_driver' | 'safe_driver' | 'multi_policy' | 'online';
  name: string;
  percentage: number;
  amount: number;
}

export interface Quote {
  id: string;
  vehicle: Vehicle;
  driver: Driver;
  premium: number;
  coverageAmount: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  validUntil: string;
  createdAt: string;
  status: 'draft' | 'active' | 'expired' | 'sold';
  agentId: string;
  companyName: string;
  discounts: Discount[];
  totalDiscount: number;
  finalPremium: number;
}

export interface QuoteFormData {
  vehicle: Partial<Vehicle>;
  driver: Partial<Driver>;
  currentStep: number;
}

export interface FilterOptions {
  status: string;
  riskLevel: string;
  dateRange: string;
  minPremium: number;
  maxPremium: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcNumber: string;
  birthDate: string;
  address: string;
  city: string;
  registrationDate: string;
  totalPolicies: number;
  totalPremium: number;
  lastPolicyDate: string;
  status: 'active' | 'inactive' | 'potential';
  riskProfile: 'low' | 'medium' | 'high';
  customerValue: 'bronze' | 'silver' | 'gold' | 'platinum';
  notes: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalPolicies: number;
  conversionRate: number;
  averagePremium: number;
  monthlyData: MonthlyData[];
  riskDistribution: RiskDistribution[];
  topVehicleBrands: BrandData[];
  customerSegments: CustomerSegment[];
  performanceMetrics: PerformanceMetric[];
}

export interface MonthlyData {
  month: string;
  revenue: number;
  policies: number;
  quotes: number;
}

export interface RiskDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

export interface BrandData {
  brand: string;
  count: number;
  revenue: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  value: number;
  color: string;
}

export interface PerformanceMetric {
  metric: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'agent' | 'manager' | 'admin';
  agencyName: string;
  agencyCode: string;
  licenseNumber: string;
  joinDate: string;
  lastLogin: string;
  isActive: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  quoteExpiry: boolean;
  newCustomer: boolean;
  policyRenewal: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export interface SystemSettings {
  language: 'tr' | 'en';
  timezone: string;
  currency: 'TRY' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  sessionTimeout: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

// frontend/project/src/types/index.ts

export interface CustomerResponse {
  id: number;
  tcNo: string;
  name: string;
  birthDate: string;
  phone: string;
}

export interface CreateQuoteRequest {
  customerId: number;
}

export interface QuoteResponse {
  id: number;
  refNo: string;
  createdAt: string;
  customerId: number;
  riskScore: number;
  premiumAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
