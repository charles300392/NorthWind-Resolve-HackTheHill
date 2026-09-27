import {
  Filter,
  RefreshCw,
  Search,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  useSearchParams,
  useNavigate,
} from "react-router-dom"

import {
  getComplaints,
} from "../services/api"

import type {
  Complaint,
} from "../types/api"


const CATEGORIES = [
  "Billing - disputed amount",
  "Billing - estimated read",
  "Metering - no read taken",
  "Supply - interruption",
  "Service - poor communication",
  "Service - missed appointment",
  "Payment - plan or arrears",
  "Water - pressure or quality",
  "Other",
]

const PRIORITIES = ["P1", "P2", "P3"]

const STATUSES = [
  "Open",
  "Closed",
  "Closed - reopened",
]


function Complaints() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] =
    useSearchParams()

  const [complaints, setComplaints] =
    useState<Complaint[]>([])

  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState(
    searchParams.get("search") ?? "",
  )

  const [priorityFilter, setPriorityFilter] =
    useState(searchParams.get("priority") ?? "All")

  const [statusFilter, setStatusFilter] =
    useState(searchParams.get("status") ?? "All")

  const [categoryFilter, setCategoryFilter] =
    useState(searchParams.get("category") ?? "All")

  const [page, setPage] = useState(0)
  const pageSize = 25

  useEffect(() => {
    const nextSearch =
      searchParams.get("search") ?? ""

    if (nextSearch !== search) {
      setSearch(nextSearch)
    }
  }, [searchParams])

  async function loadComplaints() {
    setLoading(true)
    setError("")

    try {
      const response = await getComplaints({
        limit: pageSize,
        offset: page * pageSize,
        search: search.trim() || undefined,
        priority:
          priorityFilter === "All"
            ? undefined
            : priorityFilter,
        status:
          statusFilter === "All"
            ? undefined
            : statusFilter,
        category:
          categoryFilter === "All"
            ? undefined
            : categoryFilter,
      })

      setComplaints(response.items)
      setTotal(response.total)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load complaints",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadComplaints()
    }, 250)

    return () => window.clearTimeout(timer)
  }, [
    search,
    priorityFilter,
    statusFilter,
    categoryFilter,
    page,
  ])

  function updateFilters(
    next: {
      search?: string
      priority?: string
      status?: string
      category?: string
    },
  ) {
    const params = new URLSearchParams()

    const nextSearch =
      next.search ??
      (next.search === ""
        ? ""
        : search)

    const nextPriority =
      next.priority ??
      priorityFilter

    const nextStatus =
      next.status ??
      statusFilter

    const nextCategory =
      next.category ??
      categoryFilter

    if (nextSearch) {
      params.set("search", nextSearch)
    }

    if (nextPriority !== "All") {
      params.set("priority", nextPriority)
    }

    if (nextStatus !== "All") {
      params.set("status", nextStatus)
    }

    if (nextCategory !== "All") {
      params.set("category", nextCategory)
    }

    setSearchParams(params)
  }

  function resetFilters() {
    setSearch("")
    setPriorityFilter("All")
    setStatusFilter("All")
    setCategoryFilter("All")
    setPage(0)
    setSearchParams({})
  }

  const visibleComplaints = useMemo(
    () => complaints,
    [complaints],
  )

  const totalPages =
    Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Complaints
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage customer complaints from the local
            Northwind dataset.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadComplaints()}
          className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Backend error: {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(0)
            updateFilters({
              search: event.target.value,
            })
          }}
          placeholder="Search by complaint ID, account, region, category..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* FILTERS */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Filter className="h-4 w-4" />
            Filters
          </div>

          <select
            value={priorityFilter}
            onChange={(event) => {
              setPriorityFilter(event.target.value)
              setPage(0)
              updateFilters({
                priority: event.target.value,
              })
            }}
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">
              All priorities
            </option>

            {PRIORITIES.map((priority) => (
              <option
                key={priority}
                value={priority}
              >
                {priority}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setPage(0)
              updateFilters({
                status: event.target.value,
              })
            }}
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">
              All statuses
            </option>

            {STATUSES.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value)
              setPage(0)
              updateFilters({
                category: event.target.value,
              })
            }}
            className="max-w-xs rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">
              All categories
            </option>

            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {(priorityFilter !== "All" ||
            statusFilter !== "All" ||
            categoryFilter !== "All" ||
            search !== "") && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* RESULT COUNT */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {visibleComplaints.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {total.toLocaleString()}
          </span>{" "}
          complaints
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Complaint
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priority
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Age
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SLA
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {visibleComplaints.map((complaint) => {
                const age =
                  complaint.days_to_close ??
                  (complaint.status.toLowerCase() ===
                  "closed"
                    ? 0
                    : null)

                return (
                  <tr
                    key={complaint.complaint_id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/complaints/${complaint.complaint_id}`,
                          )
                        }
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {complaint.complaint_id}
                      </button>

                      <p className="mt-1 text-xs text-slate-400">
                        {complaint.date_opened ?? "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {complaint.account_id}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {complaint.category}
                    </td>

                    <td className="px-6 py-4">
                      <PriorityBadge
                        priority={complaint.priority}
                      />
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {age === null
                        ? "Open"
                        : `${age} days`}
                    </td>

                    <td className="px-6 py-4">
                      <SLABadge
                        breached={
                          complaint.sla_breach === 1
                        }
                        slaDays={complaint.sla_days}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={complaint.status}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading complaints...
          </div>
        )}

        {!loading &&
          visibleComplaints.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-900">
                No complaints found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-900">
              {page + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {totalPages}
            </span>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() =>
                setPage((current) =>
                  Math.max(0, current - 1),
                )
              }
              className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages - 1,
                    current + 1,
                  ),
                )
              }
              className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


function PriorityBadge({
  priority,
}: {
  priority: string
}) {
  const styles: Record<string, string> = {
    P1: "bg-red-100 text-red-700",
    P2: "bg-orange-100 text-orange-700",
    P3: "bg-slate-100 text-slate-700",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[priority] ??
        "bg-slate-100 text-slate-700"
      }`}
    >
      {priority}
    </span>
  )
}


function SLABadge({
  breached,
  slaDays,
}: {
  breached: boolean
  slaDays: number
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          breached
            ? "bg-red-100 text-red-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {breached ? "Breached" : "Within SLA"}
      </span>

      <span className="text-[11px] text-slate-400">
        {slaDays} days
      </span>
    </div>
  )
}


function StatusBadge({
  status,
}: {
  status: string
}) {
  const styles: Record<string, string> = {
    Open: "bg-blue-100 text-blue-700",
    Closed: "bg-emerald-100 text-emerald-700",
    "Closed - reopened":
      "bg-amber-100 text-amber-700",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ??
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  )
}


export default Complaints
