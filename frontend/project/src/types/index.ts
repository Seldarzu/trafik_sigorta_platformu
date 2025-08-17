// ==============================
// Ortak Tipler
// ==============================
export type ID = string;
export type ISODate = string;

export type Page =
  | 'dashboard'
  | 'new-quote'
  | 'quotes'
  | 'customers'
  | 'analytics'
  | 'policies'
  | 'settings';

export type FuelType = 'gasoline' | 'diesel' | 'lpg' | 'electric' | 'hybrid';
export type UsageType = 'personal' | 'commercial' | 'taxi' | 'truck';
export type Gender = 'male' | 'female';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type Education =
  | 'primary'
  | 'secondary'
  | 'high_school'
  | 'university'
  | 'postgraduate';

export type RiskLevel = 'low' | 'medium' | 'high';
export type QuoteStatus = 'draft' | 'active' | 'expired' | 'sold';
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type SortOrder = 'asc' | 'desc';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash' | 'installment';

// ==============================
// Basit özet tipler (UI bazı yerlerde bunları bekliyor)
// ==============================
export interface VehicleSummary {
  brand?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
}

export interface DriverSummary {
  firstName?: string;
  lastName?: string;
  profession?: string;
  hasAccidents?: boolean;
  hasViolations?: boolean;
}

// ==============================
// Çekirdek Varlıklar
// ==============================
export interface Vehicle {
  id?: ID;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  engineSize: string;
  fuelType: FuelType;
  usage: UsageType;
  cityCode: string;
}

export interface Driver {
  id?: ID;
  firstName: string;
  lastName: string;
  tcNumber: string;
  birthDate: ISODate;
  licenseDate: ISODate;
  gender: Gender;
  maritalStatus: MaritalStatus;
  education: Education;
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

// ==============================
// InsuranceCompany
// ==============================
export interface InsuranceCompany {
  id: ID;
  name: string;
  isActive?: boolean;
  code?: string;
  contactInfo?: {
    phone?: string;
    website?: string;
    rating?: number;
  };
  logoUrl?: string;
  rating?: number;
  totalReviews?: number;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  createdAt?: ISODate;
  updatedAt?: ISODate;
}

// ==============================
// Quote
// ==============================
export interface Quote {
  id: ID;
  customerId?: ID | null;
  vehicleId?: ID | null;
  driverId?: ID | null;
  agentId?: ID | null;

  premium: number;
  finalPremium: number;
  totalDiscount?: number;

  riskScore?: number;
  riskLevel?: RiskLevel;
  status?: QuoteStatus;

  coverageAmount?: number;
  createdAt?: ISODate;

  vehicle?: VehicleSummary;
  driver?: DriverSummary;

  companyName?: string;
  coverageDetails?: {
    personalInjuryPerPerson?: number;
    personalInjuryPerAccident?: number;
    propertyDamage?: number;
    medicalExpenses?: number;
    legalProtection?: boolean;
    roadAssistance?: boolean;
    replacementVehicle?: boolean;
    personalAccident?: number;
  };

  discounts?: Discount[];
  uniqueRefNo?: string;
  validUntil?: ISODate;
  policyTerms?: Record<string, any>;
  specialConditions?: string;
  isRecommended?: boolean;
  recommendationScore?: number;
}

export interface CreateQuoteRequest {
  customerId: ID | null | string;
  vehicleId: ID | string;
  driverId: ID | string;
  agentId: ID | string;
  riskScore?: number;
  coverageAmount?: number;
  premiumAmount?: number;
}

// ==============================
// Policy / Customer / Analytics
// ==============================
export interface PolicyInstallment {
  id: ID;
  policyId: ID;
  installmentNumber: number;
  amount: number;
  dueDate: ISODate;
  paidDate?: ISODate;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
}

export interface PolicyClaim {
  id: ID;
  policyId: ID;
  claimNumber: string;
  incidentDate: ISODate;
  reportDate: ISODate;
  claimType: 'accident' | 'theft' | 'damage' | 'liability';
  description: string;
  estimatedAmount: number;
  approvedAmount?: number;
  status: 'reported' | 'investigating' | 'approved' | 'rejected' | 'paid';
  documents: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface Policy {
  id: ID;
  customerId: ID;
  quoteId?: ID;
  policyNumber: string;
  vehicle: Vehicle;
  driver: Driver;
  premium: number;
  finalPremium: number;
  coverageAmount: number;
  startDate: ISODate;
  endDate: ISODate;
  status: PolicyStatus;
  companyName: string;
  agentId: ID;
  discounts: Discount[];
  totalDiscount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  installments?: PolicyInstallment[];
  claims?: PolicyClaim[];
  renewalDate?: ISODate;
  isAutoRenewal: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface Customer {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcNumber: string;
  birthDate: ISODate;
  address: string;
  city: string;
  registrationDate: ISODate;
  totalPolicies: number;
  totalPremium: number;
  lastPolicyDate: ISODate;
  status: 'active' | 'inactive' | 'potential';
  riskProfile: RiskLevel;
  customerValue: 'bronze' | 'silver' | 'gold' | 'platinum';
  notes: string;
  loyaltyPoints?: number;
  referralCount?: number;
  hasMultipleVehicles?: boolean;
  averageClaimFrequency?: number;
  policies?: Policy[];
}

export interface UserProfile {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'agent' | 'manager' | 'admin';
  agencyName: string;
  agencyCode: string;
  licenseNumber: string;
  joinDate: ISODate;
  lastLogin: ISODate;
  isActive: boolean;
  logoUrl?: string;
  websiteUrl?: string;
  address?: string;
  rating?: number;
  totalReviews?: number;
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
  id: ID;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: ISODate;
  actionUrl?: string;
  actionText?: string;
  apiKeyEncrypted?: string;
  pricingConfig?: Record<string, any>;
  coverageConfig?: Record<string, any>;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  policies: number;
  quotes: number;
}

export interface RiskDistribution {
  level: RiskLevel | string;
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

// ==============================
// Karşılaştırma / Ek tipler
// ==============================
export interface Company {
  id: ID;
  name: string;
  logoUrl?: string;
}

export interface InsuranceOffer {
  company: Company;
  premium: number;
  finalPremium: number;
  coverageAmount: number;
  coverages: { name: string; included: boolean; limit?: number }[];
}

// ==============================
// Create DTO'lar
// ==============================
export interface CreateCustomerDto {
  tcNumber: string;
  firstName: string;
  lastName: string;
  birthDate: ISODate;
  phone?: string;
  email?: string;
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'potential';
  riskProfile: RiskLevel;
  customerValue: 'bronze' | 'silver' | 'gold' | 'platinum';
  notes?: string;
}

export interface CreateDriverDto {
  firstName: string;
  lastName: string;
  tcNumber: string;
  birthDate: string;        // 'YYYY-MM-DD'
  licenseDate?: string;     // 'YYYY-MM-DD'
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  education?: 'primary' | 'secondary' | 'high_school' | 'university' | 'postgraduate';
  profession?: string;
  hasAccidents?: boolean;
  accidentCount?: number;
  hasViolations?: boolean;
  violationCount?: number;
}

export interface CustomerResponse {
  id: number | string;
  name: string;
  tcNo: string;
}

export interface QuoteResponse {
  id?: number | string;
  refNo: string;
  premiumAmount: number;
  riskScore: number;
  status: string;
}

// Araç & Teklif create DTO'ları
export interface CreateVehicleDto {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  engineSize?: string;
  fuelType?: FuelType;
  usage?: UsageType;
  cityCode?: string;
}

export interface CreateQuoteDto {
  customerId: ID | string;
  riskScore: number;
  premiumAmount: number;
  vehicle: CreateVehicleDto;
  driver: CreateDriverDto;
}
