import {
  Filter,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  getComplaints,
} from "../services/api"

import type {
  Complaint,
} from "../types/api"


const PAGE_SIZE = 25


function Complaints() {

  const navigate =
    useNavigate()


  const [
    items,
    setItems,
  ] =
    useState<Complaint[]>([])


  const [
    total,
    setTotal,
  ] =
    useState(0)


  const [
    offset,
    setOffset,
  ] =
    useState(0)


  const [
    search,
    setSearch,
  ] =
    useState("")


  const [
    priority,
    setPriority,
  ] =
    useState("")


  const [
    status,
    setStatus,
  ] =
    useState("")


  const [
    category,
    setCategory,
  ] =
    useState("")


  const [
    loading,
    setLoading,
  ] =
    useState(true)


  const [
    error,
    setError,
  ] =
    useState("")


  async function load() {

    setLoading(true)
    setError("")


    try {

      const response =
        await getComplaints({
          limit: PAGE_SIZE,
          offset,
          priority,
          status,
          category,
          search,
        })


      setItems(
        response.items,
      )


      setTotal(
        response.total,
      )

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

    void load()

  }, [
    offset,
    priority,
    status,
    category,
    search,
  ])


  const pages =
    Math.max(
      1,
      Math.ceil(
        total / PAGE_SIZE,
      ),
    )


  const currentPage =
    Math.floor(
      offset / PAGE_SIZE,
    ) + 1


  return (

    <div className="space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Complaints
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Live complaints loaded from the local Northwind dataset.
          </p>

        </div>


        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/complaints/new")}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New complaint
          </button>

          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

      </div>


      <div className="rounded-xl border bg-white p-4 shadow-sm">

        <div className="flex flex-wrap items-center gap-3">

          <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">

            <Search className="h-4 w-4 text-slate-400" />

            <input
              value={search}
              onChange={(event) => {
                setOffset(0)
                setSearch(event.target.value)
              }}
              placeholder="Search complaint ID, account, region, category..."
              className="w-full bg-transparent text-sm outline-none"
            />

          </div>


          <Filter className="h-4 w-4 text-slate-400" />


          <select
            value={priority}
            onChange={(event) => {

              setOffset(0)

              setPriority(
                event.target.value,
              )

            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >

            <option value="">
              All priorities
            </option>

            <option value="P1">
              P1
            </option>

            <option value="P2">
              P2
            </option>

            <option value="P3">
              P3
            </option>

            <option value="P4">
              P4
            </option>

          </select>


          <select
            value={status}
            onChange={(event) => {

              setOffset(0)

              setStatus(
                event.target.value,
              )

            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >

            <option value="">
              All statuses
            </option>

            <option value="Open">
              Open
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>


          <select
            value={category}
            onChange={(event) => {

              setOffset(0)

              setCategory(
                event.target.value,
              )

            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >

            <option value="">
              All categories
            </option>

            <option value="Billing - disputed amount">
              Billing - disputed amount
            </option>

            <option value="Billing - estimated read">
              Billing - estimated read
            </option>

            <option value="Metering - no read">
              Metering - no read
            </option>

            <option value="Metering - incorrect read">
              Metering - incorrect read
            </option>

            <option value="Payment - plan/arrears">
              Payment - plan/arrears
            </option>

            <option value="Service - poor communication">
              Service - poor communication
            </option>

            <option value="Supply - interruption">
              Supply - interruption
            </option>

            <option value="Water - pressure/quality">
              Water - pressure/quality
            </option>

          </select>

        </div>

      </div>


      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Backend error: {error}
        </div>

      )}


      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b bg-slate-50">

              <tr>

                {[
                  "Complaint",
                  "Account",
                  "Category",
                  "Priority",
                  "Region",
                  "Age / SLA",
                  "Status",
                ].map(
                  (label) => (

                    <th
                      key={label}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {label}
                    </th>

                  ),
                )}

              </tr>

            </thead>


            <tbody className="divide-y">

              {items.map(
                (item) => (

                  <tr
                    key={
                      item.complaint_id
                    }
                    className="hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/complaints/${item.complaint_id}`,
                          )
                        }
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {item.complaint_id}
                      </button>

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.account_id}
                    </td>


                    <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                      {item.category}
                    </td>


                    <td className="px-5 py-4">

                      <Badge
                        value={
                          item.priority
                        }
                      />

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.region}
                    </td>


                    <td className="px-5 py-4 text-sm text-slate-600">

                      {
                        item.days_to_close ===
                        null
                          ? "Open"
                          : `${item.days_to_close} d`
                      }


                      <div
                        className={`mt-1 text-xs font-medium ${
                          item.sla_breach
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >

                        {
                          item.sla_breach
                            ? "SLA breached"
                            : "Within SLA"
                        }

                      </div>

                    </td>


                    <td className="px-5 py-4">

                      <Badge
                        value={
                          item.status
                        }
                      />

                    </td>

                  </tr>

                ),
              )}

            </tbody>

          </table>

        </div>


        {loading && (

          <div className="p-8 text-center text-sm text-slate-500">
            Loading...
          </div>

        )}


        {!loading &&
          items.length ===
            0 && (

            <div className="p-10 text-center text-sm text-slate-500">
              No complaints found.
            </div>

          )}

      </div>


      <div className="flex items-center justify-between text-sm text-slate-500">

        <span>
          Page {currentPage} of{" "}
          {pages} ·{" "}
          {total.toLocaleString()}{" "}
          complaints
        </span>


        <div className="flex gap-2">

          <button
            disabled={
              offset === 0
            }
            onClick={() =>
              setOffset(
                Math.max(
                  0,
                  offset -
                    PAGE_SIZE,
                ),
              )
            }
            className="rounded-lg border bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>


          <button
            disabled={
              currentPage >= pages
            }
            onClick={() =>
              setOffset(
                offset +
                  PAGE_SIZE,
              )
            }
            className="rounded-lg border bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  )
}


function Badge({
  value,
}: {
  value: string
}) {

  const lower =
    value.toLowerCase()


  const style =
    lower.includes("p1") ||
    lower.includes("critical") ||
    lower.includes("breach")

      ? "bg-red-100 text-red-700"

      : lower.includes("p2") ||
        lower.includes("open")

        ? "bg-orange-100 text-orange-700"

        : lower.includes("closed") ||
          lower.includes("p4")

          ? "bg-green-100 text-green-700"

          : "bg-slate-100 text-slate-700"


  return (

    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {value}
    </span>

  )
}


export default Complaints