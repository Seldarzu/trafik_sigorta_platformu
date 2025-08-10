// src/types.ts
export type Page =
  | 'dashboard'
  | 'new-quote'
  | 'quotes'
  | 'customers'
  | 'analytics'
  | 'settings'
  | 'policies';

/* ------------ Quote tarafı için özet tipler ------------- */
export type VehicleSummary = {
  brand?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
};

export type DriverSummary = {
  firstName?: string;
  lastName?: string;
  profession?: string;
  hasAccidents?: boolean;
  hasViolations?: boolean;
};

export type Quote = {
  id: string;
  uniqueRefNo?: string;
  companyName?: string;
  premiumAmount?: number;
  finalPremium?: number;
  totalDiscount?: number;
  coverageAmount?: number;
  riskScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  status?: 'draft' | 'active' | 'expired' | 'sold';
  validUntil?: string;   // ISO
  createdAt?: string;    // ISO
  discounts?: { name: string; percentage: number }[];
  vehicle?: VehicleSummary;
  driver?: DriverSummary;
};

export type FilterOptions = {
  status: '' | 'active' | 'expired' | 'sold' | 'draft' | 'pending' | 'approved' | 'rejected';
  riskLevel: '' | 'low' | 'medium' | 'high';
  minPremium: number;
  maxPremium: number;
  sortBy: 'createdAt' | 'finalPremium' | 'riskScore';
  sortOrder: 'asc' | 'desc';
};

/* ------------------- Müşteri Tipleri -------------------- */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcNumber: string;
  birthDate: string;          // ISO
  address?: string;
  city?: string;
  registrationDate: string;   // ISO
  totalPolicies?: number;
  totalPremium?: number;
  lastPolicyDate?: string;    // ISO
  status: 'active' | 'inactive' | 'potential';
  riskProfile: 'low' | 'medium' | 'high';
  customerValue: 'bronze' | 'silver' | 'gold' | 'platinum';
  notes?: string;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcNumber: string;
  birthDate: string; // ISO (yyyy-MM-dd veya yyyy-MM-ddTHH:mm:ssZ)
  address?: string;
  city?: string;
  status: 'potential' | 'active' | 'inactive';
  riskProfile: 'low' | 'medium' | 'high';
  customerValue: 'bronze' | 'silver' | 'gold' | 'platinum';
  notes?: string;
}

/* Analytics (dokunmadım; mevcut kullanım için bırakıldı) */
export interface OverviewData { totalRevenue: number; totalPolicies: number; conversionRate: number; averagePremium: number; }
export interface MonthlyData { month: string; revenue: number; policies: number; quotes: number; }
export interface RiskDistribution { level: string; count: number; percentage: number; color: string; }
export interface BrandData { brand: string; count: number; revenue: number; }
export interface SegmentData { segment: string; count: number; value: number; color: string; }
export interface PerformanceMetric { metric: string; current: number; previous: number; target: number; unit: string; }
export interface AnalyticsData {
  totalRevenue: number; totalPolicies: number; conversionRate: number; averagePremium: number;
  monthlyData: MonthlyData[]; riskDistribution: RiskDistribution[]; topVehicleBrands: BrandData[];
  customerSegments: SegmentData[]; performanceMetrics: PerformanceMetric[];
}

/* Bildirim vs. */
export interface Notification {
  id: string; title: string; message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean; createdAt: string; actionUrl?: string; actionText?: string;
}

export type Policy = {
  id: string
  policyNumber: string
  companyName?: string
  coverageAmount: number
  finalPremium: number
  totalDiscount?: number
  riskScore?: number
  status: 'active' | 'expired' | 'pending' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'overdue'
  startDate: string
  endDate: string
  isAutoRenewal?: boolean
  vehicle: {
    plateNumber: string
    brand: string
    model: string
    year: number
  }
  driver: {
    firstName: string
    lastName: string
    tcNumber?: string
    profession?: string
  }
  discounts: { name: string; percentage: number }[]
}

export type PolicyInstallment = {
  id: string
  installmentNumber: number
  amount: number
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
  paidDate?: string
}

export type PolicyClaim = {
  id: string
  claimNumber: string
  status: 'paid' | 'approved' | 'investigating' | 'rejected'
  description: string
  incidentDate: string
  reportDate: string
  approvedAmount?: number
  estimatedAmount: number
}
export type User = {
  id: string;        
  firstName: string;
  lastName: string;
  email: string;
};

export type UpdateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
};