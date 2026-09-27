import type {
  AIAnalysis,
  AnalyzeComplaintRequest,
  Complaint,
  ComplaintContext,
  ComplaintFilters,
  ComplaintListResponse,
  CustomerListResponse,
  DashboardSummary,
} from "../types/api"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000"


async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        Accept: "application/json",

        ...(options?.body
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...(options?.headers ?? {}),
      },
    },
  )


  if (!response.ok) {

    const text =
      await response.text()

    throw new Error(
      text ||
        `API request failed with status ${response.status}`,
    )
  }


  return response.json() as Promise<T>
}


/* =========================
   HEALTH
========================= */

export function getHealth() {

  return request<{
    status: string
    service: string
  }>("/health")
}


/* =========================
   DASHBOARD
========================= */

export function getDashboardSummary() {

  return request<DashboardSummary>(
    "/api/dashboard/summary",
  )
}


/* =========================
   COMPLAINTS
========================= */

export function getComplaints(
  filters: ComplaintFilters = {},
) {

  const params =
    new URLSearchParams()


  for (
    const [key, value]
    of Object.entries(filters)
  ) {

    if (
      value !== undefined &&
      value !== ""
    ) {

      params.set(
        key,
        String(value),
      )
    }
  }


  const query =
    params.toString()


  return request<ComplaintListResponse>(
    `/api/complaints${
      query
        ? `?${query}`
        : ""
    }`,
  )
}


export function getComplaint(
  complaintId: string,
) {

  return request<Complaint>(
    `/api/complaints/${encodeURIComponent(
      complaintId,
    )}`,
  )
}


export function getComplaintContext(
  complaintId: string,
) {

  return request<ComplaintContext>(
    `/api/complaints/${encodeURIComponent(
      complaintId,
    )}/context`,
  )
}


/* =========================
   AI
========================= */

export function analyzeComplaint(
  input: AnalyzeComplaintRequest,
) {

  return request<AIAnalysis>(
    "/api/complaints/analyze",
    {
      method: "POST",

      body: JSON.stringify(
        input,
      ),
    },
  )
}


/* =========================
   CUSTOMERS
========================= */

export function getCustomers(
  params: {
    limit?: number
    offset?: number
    search?: string
  } = {},
) {

  const query =
    new URLSearchParams()


  if (
    params.limit !== undefined
  ) {

    query.set(
      "limit",
      String(params.limit),
    )
  }


  if (
    params.offset !== undefined
  ) {

    query.set(
      "offset",
      String(params.offset),
    )
  }


  if (params.search) {

    query.set(
      "search",
      params.search,
    )
  }


  const suffix =
    query.toString()
      ? `?${query.toString()}`
      : ""


  return request<CustomerListResponse>(
    `/api/customers${suffix}`,
  )
}

/* =========================
   EXTENDED ANALYTICS
========================= */

export function getUnitCosts() {
  return request<Record<string, number>>(
    "/api/analytics/unit-costs",
  )
}

export function getAIPilotSummary() {
  return request<Record<string, number | string>>(
    "/api/analytics/ai-pilot",
  )
}
