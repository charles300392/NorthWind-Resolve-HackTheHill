import {
  ArrowRight,
  Search,
  UserRound,
} from "lucide-react"
import { useMemo, useState } from "react"

import {
  complaints,
  customers,
} from "../data/mockData"

function Customers() {
  const [search, setSearch] = useState("")

  const customerRows = useMemo(() => {
    return customers
      .map((customer) => {
        const customerComplaints = complaints.filter(
          (complaint) =>
            complaint.customerId === customer.id,
        )

        const openCases = customerComplaints.filter(
          (complaint) =>
            complaint.status !== "Resolved",
        ).length

        const highestRisk =
          customerComplaints.length > 0
            ? Math.max(
                ...customerComplaints.map(
                  (complaint) => complaint.slaRisk,
                ),
              )
            : 0

        return {
          ...customer,
          complaints: customerComplaints.length,
          openCases,
          highestRisk,
        }
      })
      .filter((customer) =>
        customer.name
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
  }, [search])

  const totalOpenCases = customerRows.reduce(
    (total, customer) =>
      total + customer.openCases,
    0,
  )

  const highRiskCustomers = customerRows.filter(
    (customer) => customer.highestRisk >= 0.8,
  ).length

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Customers
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Customer profiles and complaint history.
        </p>
      </div>

      {/* SEARCH */}

      <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search customers..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Customers shown"
          value={customerRows.length.toString()}
          description="Customers with complaint activity"
        />

        <SummaryCard
          title="Open cases"
          value={totalOpenCases.toString()}
          description="Cases requiring attention"
        />

        <SummaryCard
          title="High-risk customers"
          value={highRiskCustomers.toString()}
          description="Customers with high SLA exposure"
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
                  Service
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Complaints
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Open cases
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Highest SLA risk
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {customerRows.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {customer.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.service}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.complaints}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.openCases}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        customer.highestRisk >= 0.8
                          ? "bg-red-100 text-red-700"
                          : customer.highestRisk >= 0.6
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {Math.round(
                        customer.highestRisk * 100,
                      )}
                      %
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
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

        {customerRows.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-900">
              No customers found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try another search.
            </p>
          </div>
        )}
      </div>
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

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default Customers