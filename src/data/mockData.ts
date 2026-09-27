export type ComplaintPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical"

export type ComplaintStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Escalated"

export type Complaint = {
  id: string
  customerName: string
  customerId: string
  service: "Electricity" | "Water"
  category: string
  priority: ComplaintPriority
  status: ComplaintStatus
  daysOpen: number
  transfers: number
  slaRisk: number
  description: string
}

export type Customer = {
  id: string
  name: string
  service: "Electricity" | "Water"
  accountStatus: "Active" | "Inactive"
}

export type MonthlyMetric = {
  month: string
  complaintsOpened: number
  complaintsClosed: number
  resolutionDays: number
  firstContactResolutionRate: number
  inboundCalls: number
  costToServePerAccount: number
  regulatorScore: number
}

export type Notification = {
  id: string
  title: string
  description: string
  type: "danger" | "warning" | "info"
  complaintId?: string
  time: string
  unread: boolean
}

export const complaints: Complaint[] = [
  {
    id: "C102391",
    customerName: "Sarah Johnson",
    customerId: "CU-48291",
    service: "Electricity",
    category: "Billing",
    priority: "High",
    status: "Open",
    daysOpen: 42,
    transfers: 3,
    slaRisk: 0.91,
    description:
      "Customer reports an unexpected electricity billing issue.",
  },
  {
    id: "C102392",
    customerName: "Michael Brown",
    customerId: "CU-39172",
    service: "Electricity",
    category: "Metering",
    priority: "Critical",
    status: "Open",
    daysOpen: 37,
    transfers: 4,
    slaRisk: 0.96,
    description:
      "Customer reports a discrepancy between the meter reading and the billed amount.",
  },
  {
    id: "C102393",
    customerName: "Emily Davis",
    customerId: "CU-58214",
    service: "Water",
    category: "Billing",
    priority: "High",
    status: "In Progress",
    daysOpen: 29,
    transfers: 2,
    slaRisk: 0.78,
    description:
      "Customer is disputing a recent water billing adjustment.",
  },
  {
    id: "C102394",
    customerName: "Daniel Wilson",
    customerId: "CU-71483",
    service: "Electricity",
    category: "Service",
    priority: "Medium",
    status: "Open",
    daysOpen: 18,
    transfers: 1,
    slaRisk: 0.54,
    description:
      "Customer reports a service-related issue requiring follow-up.",
  },
  {
    id: "C102395",
    customerName: "Olivia Martinez",
    customerId: "CU-62914",
    service: "Electricity",
    category: "Billing",
    priority: "High",
    status: "Open",
    daysOpen: 51,
    transfers: 5,
    slaRisk: 0.98,
    description:
      "Customer has an unresolved billing complaint with multiple previous transfers.",
  },
]

export const customers: Customer[] = [
  {
    id: "CU-48291",
    name: "Sarah Johnson",
    service: "Electricity",
    accountStatus: "Active",
  },
  {
    id: "CU-39172",
    name: "Michael Brown",
    service: "Electricity",
    accountStatus: "Active",
  },
  {
    id: "CU-58214",
    name: "Emily Davis",
    service: "Water",
    accountStatus: "Active",
  },
  {
    id: "CU-71483",
    name: "Daniel Wilson",
    service: "Electricity",
    accountStatus: "Active",
  },
  {
    id: "CU-62914",
    name: "Olivia Martinez",
    service: "Electricity",
    accountStatus: "Active",
  },
]

/*
 * Real Northwind monthly KPI data
 * Source: northwind_monthly_kpis.csv
 *
 * Period: October 2024 → September 2026
 */
export const monthlyMetrics: MonthlyMetric[] = [
  {
    month: "2024-10",
    complaintsOpened: 912,
    complaintsClosed: 476,
    resolutionDays: 9.1,
    firstContactResolutionRate: 0.62,
    inboundCalls: 38925,
    costToServePerAccount: 19.32,
    regulatorScore: 4.3,
  },
  {
    month: "2024-11",
    complaintsOpened: 830,
    complaintsClosed: 760,
    resolutionDays: 16.5,
    firstContactResolutionRate: 0.611,
    inboundCalls: 41882,
    costToServePerAccount: 18.68,
    regulatorScore: 4.22,
  },
  {
    month: "2024-12",
    complaintsOpened: 951,
    complaintsClosed: 873,
    resolutionDays: 18.4,
    firstContactResolutionRate: 0.602,
    inboundCalls: 41827,
    costToServePerAccount: 17.59,
    regulatorScore: 4.15,
  },
  {
    month: "2025-01",
    complaintsOpened: 985,
    complaintsClosed: 927,
    resolutionDays: 19.5,
    firstContactResolutionRate: 0.593,
    inboundCalls: 42185,
    costToServePerAccount: 18.54,
    regulatorScore: 4.08,
  },
  {
    month: "2025-02",
    complaintsOpened: 851,
    complaintsClosed: 840,
    resolutionDays: 20.1,
    firstContactResolutionRate: 0.584,
    inboundCalls: 47539,
    costToServePerAccount: 19.21,
    regulatorScore: 4.0,
  },
  {
    month: "2025-03",
    complaintsOpened: 901,
    complaintsClosed: 901,
    resolutionDays: 21.4,
    firstContactResolutionRate: 0.575,
    inboundCalls: 45254,
    costToServePerAccount: 19.53,
    regulatorScore: 3.92,
  },
  {
    month: "2025-04",
    complaintsOpened: 1023,
    complaintsClosed: 952,
    resolutionDays: 22.0,
    firstContactResolutionRate: 0.566,
    inboundCalls: 44533,
    costToServePerAccount: 19.86,
    regulatorScore: 3.85,
  },
  {
    month: "2025-05",
    complaintsOpened: 1004,
    complaintsClosed: 942,
    resolutionDays: 23.2,
    firstContactResolutionRate: 0.557,
    inboundCalls: 45261,
    costToServePerAccount: 19.67,
    regulatorScore: 3.77,
  },
  {
    month: "2025-06",
    complaintsOpened: 982,
    complaintsClosed: 965,
    resolutionDays: 23.1,
    firstContactResolutionRate: 0.548,
    inboundCalls: 45995,
    costToServePerAccount: 20.68,
    regulatorScore: 3.7,
  },
  {
    month: "2025-07",
    complaintsOpened: 1222,
    complaintsClosed: 1062,
    resolutionDays: 24.9,
    firstContactResolutionRate: 0.539,
    inboundCalls: 45068,
    costToServePerAccount: 20.89,
    regulatorScore: 3.62,
  },
  {
    month: "2025-08",
    complaintsOpened: 1026,
    complaintsClosed: 1089,
    resolutionDays: 26.6,
    firstContactResolutionRate: 0.53,
    inboundCalls: 51278,
    costToServePerAccount: 20.14,
    regulatorScore: 3.55,
  },
  {
    month: "2025-09",
    complaintsOpened: 1020,
    complaintsClosed: 1000,
    resolutionDays: 28.6,
    firstContactResolutionRate: 0.521,
    inboundCalls: 50278,
    costToServePerAccount: 20.71,
    regulatorScore: 3.47,
  },
  {
    month: "2025-10",
    complaintsOpened: 1189,
    complaintsClosed: 1029,
    resolutionDays: 27.6,
    firstContactResolutionRate: 0.512,
    inboundCalls: 52097,
    costToServePerAccount: 20.74,
    regulatorScore: 3.4,
  },
  {
    month: "2025-11",
    complaintsOpened: 940,
    complaintsClosed: 1067,
    resolutionDays: 29.8,
    firstContactResolutionRate: 0.503,
    inboundCalls: 50278,
    costToServePerAccount: 21.29,
    regulatorScore: 3.32,
  },
  {
    month: "2025-12",
    complaintsOpened: 1120,
    complaintsClosed: 1019,
    resolutionDays: 29.6,
    firstContactResolutionRate: 0.494,
    inboundCalls: 51380,
    costToServePerAccount: 21.63,
    regulatorScore: 3.25,
  },
  {
    month: "2026-01",
    complaintsOpened: 1177,
    complaintsClosed: 1025,
    resolutionDays: 31.0,
    firstContactResolutionRate: 0.485,
    inboundCalls: 50012,
    costToServePerAccount: 21.68,
    regulatorScore: 3.17,
  },
  {
    month: "2026-02",
    complaintsOpened: 1002,
    complaintsClosed: 1000,
    resolutionDays: 33.6,
    firstContactResolutionRate: 0.476,
    inboundCalls: 49721,
    costToServePerAccount: 21.85,
    regulatorScore: 3.1,
  },
  {
    month: "2026-03",
    complaintsOpened: 1104,
    complaintsClosed: 1091,
    resolutionDays: 33.4,
    firstContactResolutionRate: 0.467,
    inboundCalls: 49012,
    costToServePerAccount: 21.7,
    regulatorScore: 3.02,
  },
  {
    month: "2026-04",
    complaintsOpened: 1186,
    complaintsClosed: 999,
    resolutionDays: 34.5,
    firstContactResolutionRate: 0.458,
    inboundCalls: 52449,
    costToServePerAccount: 22.66,
    regulatorScore: 2.95,
  },
  {
    month: "2026-05",
    complaintsOpened: 1190,
    complaintsClosed: 1058,
    resolutionDays: 36.7,
    firstContactResolutionRate: 0.449,
    inboundCalls: 53811,
    costToServePerAccount: 23.38,
    regulatorScore: 2.88,
  },
  {
    month: "2026-06",
    complaintsOpened: 1214,
    complaintsClosed: 1135,
    resolutionDays: 38.6,
    firstContactResolutionRate: 0.44,
    inboundCalls: 54300,
    costToServePerAccount: 21.89,
    regulatorScore: 2.8,
  },
  {
    month: "2026-07",
    complaintsOpened: 1347,
    complaintsClosed: 1223,
    resolutionDays: 40.2,
    firstContactResolutionRate: 0.431,
    inboundCalls: 55118,
    costToServePerAccount: 23.3,
    regulatorScore: 2.72,
  },
  {
    month: "2026-08",
    complaintsOpened: 1189,
    complaintsClosed: 1195,
    resolutionDays: 41.6,
    firstContactResolutionRate: 0.422,
    inboundCalls: 52900,
    costToServePerAccount: 23.68,
    regulatorScore: 2.65,
  },
  {
    month: "2026-09",
    complaintsOpened: 1139,
    complaintsClosed: 1118,
    resolutionDays: 43.8,
    firstContactResolutionRate: 0.413,
    inboundCalls: 55830,
    costToServePerAccount: 22.61,
    regulatorScore: 2.58,
  },
]

const latestMetric = monthlyMetrics[monthlyMetrics.length - 1]

export const dashboardMetrics = {
  openComplaints: 1599,
  averageResolutionDays: latestMetric.resolutionDays,
  previousResolutionDays: 9.1,
  slaBreachRisk: 77,
  regulatorScore: latestMetric.regulatorScore,
  regulatorTarget: 4.0,
  firstContactResolutionRate: latestMetric.firstContactResolutionRate,
  inboundCalls: latestMetric.inboundCalls,
  costToServePerAccount: latestMetric.costToServePerAccount,
}

export const categoryData = [
  { name: "Billing", value: 3 },
  { name: "Metering", value: 2 },
  { name: "Service", value: 1 },
]

export const resolutionData = [
  { name: "Open", value: 1599 },
  { name: "In Progress", value: 428 },
  { name: "Resolved", value: 312 },
]

export const notifications: Notification[] = [
  {
    id: "N001",
    title: "Critical complaint requires attention",
    description: "C102392 has a 96% SLA risk.",
    type: "danger",
    complaintId: "C102392",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "N002",
    title: "SLA breach risk increased",
    description: "C102395 has reached 98% SLA risk.",
    type: "danger",
    complaintId: "C102395",
    time: "8 min ago",
    unread: true,
  },
  {
    id: "N003",
    title: "Complaint approaching SLA threshold",
    description: "C102391 currently has a 91% SLA risk.",
    type: "warning",
    complaintId: "C102391",
    time: "16 min ago",
    unread: true,
  },
  {
    id: "N004",
    title: "Response awaiting approval",
    description: "A generated response is ready for agent review.",
    type: "info",
    complaintId: "C102393",
    time: "32 min ago",
    unread: false,
  },
]