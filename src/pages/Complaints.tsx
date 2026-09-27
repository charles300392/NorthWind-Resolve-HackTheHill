import { useMemo, useState } from "react"
import { Filter, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { complaints } from "../data/mockData"

function Complaints() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const filteredComplaints = useMemo(() => {
    const searchValue = search.toLowerCase()

    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.id.toLowerCase().includes(searchValue) ||
        complaint.customerName
          .toLowerCase()
          .includes(searchValue) ||
        complaint.category
          .toLowerCase()
          .includes(searchValue)

      const matchesPriority =
        priorityFilter === "All" ||
        complaint.priority === priorityFilter

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus &&
        matchesCategory
      )
    })
  }, [
    search,
    priorityFilter,
    statusFilter,
    categoryFilter,
  ])

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Complaints
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review and manage customer complaints.
        </p>
      </div>

      {/* SEARCH */}

      <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by complaint ID, customer, or category..."
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

          {/* PRIORITY */}

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">All priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">All categories</option>
            <option value="Billing">Billing</option>
            <option value="Metering">Metering</option>
            <option value="Service">Service</option>
          </select>

          {/* RESET */}

          {(priorityFilter !== "All" ||
            statusFilter !== "All" ||
            categoryFilter !== "All" ||
            search !== "") && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setPriorityFilter("All")
                setStatusFilter("All")
                setCategoryFilter("All")
              }}
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
            {filteredComplaints.length}
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
                  Customer
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
                  SLA Risk
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  {/* COMPLAINT */}

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/complaints/${complaint.id}`)
                      }
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {complaint.id}
                    </button>
                  </td>

                  {/* CUSTOMER */}

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {complaint.customerName}
                  </td>

                  {/* CATEGORY */}

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {complaint.category}
                  </td>

                  {/* PRIORITY */}

                  <td className="px-6 py-4">
                    <PriorityBadge
                      priority={complaint.priority}
                    />
                  </td>

                  {/* AGE */}

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {complaint.daysOpen} days
                  </td>

                  {/* SLA */}

                  <td className="px-6 py-4">
                    <SLABadge risk={complaint.slaRisk} />
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}

        {filteredComplaints.length === 0 && (
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
    </div>
  )
}

function PriorityBadge({
  priority,
}: {
  priority: string
}) {
  const styles = {
    Low: "bg-slate-100 text-slate-700",
    Medium: "bg-blue-100 text-blue-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
  }

  const style =
    styles[priority as keyof typeof styles] ??
    "bg-slate-100 text-slate-700"

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {priority}
    </span>
  )
}

function SLABadge({
  risk,
}: {
  risk: number
}) {
  const percentage = Math.round(risk * 100)

  let styles = "bg-green-100 text-green-700"

  if (percentage >= 80) {
    styles = "bg-red-100 text-red-700"
  } else if (percentage >= 60) {
    styles = "bg-orange-100 text-orange-700"
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {percentage}%
    </span>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  const styles = {
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Resolved: "bg-green-100 text-green-700",
    Escalated: "bg-red-100 text-red-700",
  }

  const style =
    styles[status as keyof typeof styles] ??
    "bg-slate-100 text-slate-700"

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  )
}

export default Complaints