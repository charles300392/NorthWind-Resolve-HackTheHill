import {
  ArrowRight,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  getCustomers,
} from "../services/api"

import type {
  CustomerSummary,
} from "../types/api"


function Customers() {
  const navigate = useNavigate()

  const [customers, setCustomers] =
    useState<CustomerSummary[]>([])

  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadCustomers() {
    setLoading(true)
    setError("")

    try {
      const response = await getCustomers({
        limit: 100,
        offset: 0,
        search,
      })

      setCustomers(response.items)
      setTotal(response.total)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customers",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCustomers()
    }, 250)

    return () => window.clearTimeout(timer)
  }, [search])

  const stats = useMemo(() => {
    const totalComplaints =
      customers.reduce(
        (sum, customer) =>
          sum + customer.complaints,
        0,
      )

    const openCases =
      customers.reduce(
        (sum, customer) =>
          sum + customer.open_cases,
        0,
      )

    const breachedCases =
      customers.reduce(
        (sum, customer) =>
          sum + customer.breached_cases,
        0,
      )

    return {
      totalComplaints,
      openCases,
      breachedCases,
    }
  }, [customers])

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Customer accounts and complaint history derived from
            the Northwind dataset.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCustomers()}
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
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search customer accounts..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Customer accounts"
          value={total.toLocaleString()}
          description="Accounts represented in the dataset."
        />

        <SummaryCard
          title="Open cases"
          value={stats.openCases.toLocaleString()}
          description="Open cases in the displayed accounts."
        />

        <SummaryCard
          title="SLA breaches"
          value={stats.breachedCases.toLocaleString()}
          description="Recorded breaches in the displayed accounts."
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Complaints
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Open cases
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SLA breaches
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reopened
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transfers
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {customers.map((customer) => (
                <tr
                  key={customer.account_id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {customer.account_id}
                        </p>

                        <p className="text-xs text-slate-500">
                          Latest:{" "}
                          {customer.latest_complaint_date ??
                            "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.complaints}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        customer.open_cases > 0
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {customer.open_cases}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        customer.breached_cases > 0
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {customer.breached_cases}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.reopened_cases}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.transfer_count}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/complaints?search=${encodeURIComponent(
                            customer.account_id,
                          )}`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      View
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading customers...
          </div>
        )}

        {!loading &&
          customers.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-900">
                No customers found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another account search.
              </p>
            </div>
          )}
      </div>

      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-900">
          {customers.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900">
          {total.toLocaleString()}
        </span>{" "}
        customer accounts.
      </p>
    </div>
  )
}


function SummaryCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}


export default Customers
