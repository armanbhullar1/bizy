// ─── Auth ────────────────────────────────────────────────────────────────────

export interface Auth0User {
  sub: string
  name: string
  email: string
  picture: string
  email_verified: boolean
}

// ─── Business Profile ────────────────────────────────────────────────────────

export type BusinessType =
  | 'food'
  | 'retail'
  | 'services'
  | 'tech'
  | 'construction'
  | 'health'
  | 'education'
  | 'other'

export type CanadianProvince =
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NL'
  | 'NS'
  | 'NT'
  | 'NU'
  | 'ON'
  | 'PE'
  | 'QC'
  | 'SK'
  | 'YT'

export type BudgetRange = 'under_5k' | '5k_25k' | '25k_100k' | 'over_100k'

export interface BusinessProfile {
  uid: string
  email?: string
  businessName: string
  businessType: BusinessType
  businessDescription: string
  province: CanadianProvince
  city: string
  targetCustomers: string
  stage: 'idea' | 'planning' | 'ready'
  budget: BudgetRange
  goals: string[]
  background?: string
  createdAt: string
}

// ─── Viability ───────────────────────────────────────────────────────────────

export interface Risk {
  title: string
  description: string
  mitigation: string
  severity: 'high' | 'medium' | 'low'
}

export interface ViabilityResult {
  score: number
  marketCondition: 'low' | 'moderate' | 'high'
  averageRevenue: {
    year1: number
    year3: number
  }
  survivalRate: {
    year1: number
    year3: number
    year5: number
  }
  grantsAvailable: number
  topRisks: Risk[]
  topOpportunities: string[]
  verdict: 'strong' | 'viable' | 'challenging' | 'risky'
  verdictSummary: string
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

export type RoadmapCategory =
  | 'legal'
  | 'financial'
  | 'licensing'
  | 'hr'
  | 'operations'
  | 'marketing'

export interface RoadmapStep {
  id: string
  title: string
  description: string
  estimatedTime: string
  estimatedCost: string
  actionUrl: string
  category: RoadmapCategory
  province?: CanadianProvince
  isComplete: boolean
  isRequired: boolean
  dependsOn?: string[]
}

// ─── Compliance ──────────────────────────────────────────────────────────────

export interface CRAForm {
  id: string
  name: string
  code: string
  description: string
  whenNeeded: string
  url: string
  categories: BusinessType[]
  provinces?: CanadianProvince[]
  aiExplanation?: string
}

export interface License {
  id: string
  name: string
  issuingAuthority: string
  province: CanadianProvince | 'federal'
  businessTypes: BusinessType[]
  description: string
  applicationUrl: string
  estimatedCost: string
  estimatedTime: string
  renewalPeriod?: string
}

// ─── HR ──────────────────────────────────────────────────────────────────────

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  department?: string
  startDate: string
  salary?: number
  payFrequency?: 'weekly' | 'biweekly' | 'monthly'
  sin?: string // Store encrypted/masked
  address?: {
    street: string
    city: string
    province: CanadianProvince
    postalCode: string
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  status: 'active' | 'onboarding' | 'terminated'
  onboardingProgress: EmployerDuty[]
  taxDocuments: TaxDocument[]
  createdAt: string
}

export interface EmployerDuty {
  id: string
  title: string
  description: string
  category: 'legal' | 'payroll' | 'benefits' | 'safety' | 'documentation'
  dueDate?: string
  isComplete: boolean
  completedAt?: string
  url?: string
}

export interface TaxDocument {
  id: string
  type: 'T4' | 'T4A' | 'T2200' | 'TD1' | 'TD1-PROV' | 'ROE' | 'other'
  year: number
  fileName: string
  fileUrl?: string
  uploadedAt: string
  status: 'draft' | 'issued' | 'filed'
}

export interface OnboardingChecklist {
  employeeName: string
  startDate: string
  role: string
  steps: ChecklistItem[]
}

export interface ChecklistItem {
  title: string
  description: string
  dueDate: string
  templateUrl?: string
  isComplete: boolean
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface IndustryBenchmark {
  businessType: BusinessType
  province: CanadianProvince | 'national'
  avgRevenue: { year1: number; year3: number; year5: number }
  avgEmployees: { year1: number; year3: number }
  survivalRate: { year1: number; year3: number; year5: number }
  avgStartupCost: number
  source: string
}

// ─── Grants ──────────────────────────────────────────────────────────────────

export interface Grant {
  id: string
  name: string
  provider: string
  amount: { min: number; max: number }
  type: 'grant' | 'loan' | 'tax_credit' | 'subsidy'
  eligibility: {
    businessTypes: BusinessType[]
    provinces: CanadianProvince[] | 'all'
    minEmployees?: number
    maxEmployees?: number
    founderCriteria?: string[]
    maxRevenue?: number
  }
  deadline?: string
  url: string
  description: string
}

// ─── Website Builder / Storefront ────────────────────────────────────────────

export type DesignStyle = 'modern' | 'classic' | 'minimal' | 'bold' | 'friendly'

export interface CustomImage {
  id: string
  url: string
  x: number  // position as percentage (0-100)
  y: number  // position in pixels from top
  width: number  // width in pixels
  zIndex: number // layer order
}

export interface WebsiteConfig {
  // Basic Info
  businessName: string
  tagline: string
  description: string
  
  // Design
  designStyle: DesignStyle
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontStyle: 'sans' | 'serif' | 'modern'
  
  // Content
  heroImage?: string
  logoUrl?: string
  services: string[]
  contactEmail: string
  contactPhone?: string
  address?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  
  // Custom Images
  images?: CustomImage[]
  
  // Features
  showPricing?: boolean
  showTestimonials?: boolean
  showContactForm?: boolean
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface WebsiteTemplate {
  id: string
  name: string
  description: string
  style: DesignStyle
  thumbnail: string
}

// ─── Reactiv / Storefront ────────────────────────────────────────────────────

export interface ReactivClipConfig {
  businessName: string
  tagline?: string
  logoUrl?: string
  primaryColor?: string
  products: ReactivProduct[]
  contactInfo: {
    phone?: string
    email?: string
    address?: string
  }
  orderType: 'inquiry' | 'purchase' | 'booking'
}

export interface ReactivProduct {
  name: string
  description?: string
  price: number
  currency: 'CAD'
  imageUrl?: string
  available: boolean
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface AppState {
  user: Auth0User | null
  businessProfile: BusinessProfile | null
  viabilityResult: ViabilityResult | null
  roadmapProgress: Record<string, boolean>
  chatHistory: ChatMessage[]
  isLoading: boolean
}
