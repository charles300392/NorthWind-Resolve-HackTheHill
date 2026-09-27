export type JsonRecord = Record<string, unknown>

export interface Complaint {
  complaint_id: string
  date_opened: string | null
  date_closed: string | null

  status: string
  channel: string
  category: string
  priority: string
  region: string
  source_system: string

  transferred_between_systems: number

  sla_days: number
  days_to_close: number | null
  sla_breach: number
  reopened: number

  resolution_action: string | null
  resolvable_by_information_only: number | null
  bill_correction_value: number | null

  account_id: string
}

export interface ComplaintListResponse {
  total: number
  limit: number
  offset: number
  count: number
  items: Complaint[]
}

export interface ComplaintFilters {
  limit?: number
  offset?: number
  region?: string
  category?: string
  priority?: string
  status?: string
}

export interface DashboardSummary {
  overall: JsonRecord
  by_region: JsonRecord[]
  by_category: JsonRecord[]
  by_priority: JsonRecord[]
  by_channel: JsonRecord[]
  monthly: JsonRecord[]
}

export interface ComplaintContext extends JsonRecord {
  complaint?: JsonRecord

  region?: string
  month?: string

  historical_breach_rate?: number
  estimated_read_rate?: number
  smart_meter_penetration?: number

  billing_exception_rate?: number
  billing_exceptions_raised?: number

  transfer_history?: boolean
  transfer_rate?: number
  reopen_rate?: number

  average_days_to_close?: number

  customer_history?: JsonRecord
  staffing?: JsonRecord
  monthly_kpis?: JsonRecord
  source_system_context?: JsonRecord
  previous_ai_pilot?: JsonRecord
  unit_costs?: JsonRecord
}

export interface AIAnalysis {
  category: string
  priority: string
  severity: string

  sla_risk: number

  root_cause: string | null
  recommendation: string | null
  response: string | null

  confidence: number
  explanation: string[]
}

export interface AnalyzeComplaintRequest {
  complaint_text: string

  customer_context?: JsonRecord
  case_context?: JsonRecord
}

export interface CustomerSummary {
  account_id: string

  complaints: number
  open_cases: number
  breached_cases: number
  reopened_cases: number
  transfer_count: number

  latest_complaint_date: string | null
}

export interface CustomerListResponse {
  total: number
  limit: number
  offset: number
  count: number
  items: CustomerSummary[]
}