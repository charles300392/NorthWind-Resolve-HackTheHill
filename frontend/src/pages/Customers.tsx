import {
  AlertTriangle,
  RefreshCw,
  Search,
  Users,
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

  const navigate =
    useNavigate()


  const [
    customers,
    setCustomers,
  ] =
    useState<CustomerSummary[]>([])


  const [
    total,
    setTotal,
  ] =
    useState(0)


  const [
    search,
    setSearch,
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


  async function loadCustomers() {

    setLoading(true)
    setError("")


    try {

      const response =
        await getCustomers({
          limit: 100,
          offset: 0,
          search,
        })


      setCustomers(
        response.items,
      )


      setTotal(
        response.total,
      )

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

    const timer =
      window.setTimeout(
        () => {
          void loadCustomers()
        },
        250,
      )


    return () =>
      window.clearTimeout(
        timer,
      )

  }, [search])


  const stats =
    useMemo(() => {

      const totalComplaints =
        customers.reduce(
          (
            sum,
            customer,
          ) =>
            sum +
            customer.complaints,
          0,
        )


      const openCases =
        customers.reduce(
          (
            sum,
            customer,
          ) =>
            sum +
            customer.open_cases,
          0,
        )


      const breachedCases =
        customers.reduce(
          (
            sum,
            customer,
          ) =>
            sum +
            customer.breached_cases,
          0,
        )


      const reopenedCases =
        customers.reduce(
          (
            sum,
            customer,
          ) =>
            sum +
            customer.reopened_cases,
          0,
        )


      return {
        totalComplaints,
        openCases,
        breachedCases,
        reopenedCases,
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
            Customer accounts derived from the Northwind complaint dataset.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            void loadCustomers()
          }
          className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >

          <RefreshCw className="h-4 w-4" />

          Refresh

        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Backend error: {error}
        </div>

      )}


      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Customer accounts"
          value={total.toLocaleString()}
          icon={Users}
        />


        <MetricCard
          title="Complaints"
          value={stats.totalComplaints.toLocaleString()}
          icon={Search}
        />


        <MetricCard
          title="Open cases"
          value={stats.openCases.toLocaleString()}
          icon={AlertTriangle}
        />


        <MetricCard
          title="SLA breaches"
          value={stats.breachedCases.toLocaleString()}
          icon={AlertTriangle}
          danger
        />

      </div>


      {/* SEARCH */}

      <div className="rounded-xl border bg-white p-4 shadow-sm">

        <div className="flex items-center gap-3 rounded-lg border bg-slate-50 px-3 py-2">

          <Search className="h-4 w-4 text-slate-400" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search by account ID..."
            className="w-full bg-transparent text-sm outline-none"
          />

        </div>

      </div>


      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Complaints
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Open cases
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SLA breaches
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reopened
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transfers
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Latest complaint
                </th>

              </tr>

            </thead>


            <tbody className="divide-y">

              {customers.map(
                (
                  customer,
                ) => (

                  <tr
                    key={
                      customer.account_id
                    }
                    className="hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/complaints?search=${encodeURIComponent(
                              customer.account_id,
                            )}`,
                          )
                        }
                        className="font-semibold text-blue-600 hover:underline"
                      >

                        {
                          customer.account_id
                        }

                      </button>

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-700">

                      {
                        customer.complaints
                      }

                    </td>


                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          customer.open_cases >
                          0
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {
                          customer.open_cases
                        }

                      </span>

                    </td>


                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          customer.breached_cases >
                          0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {
                          customer.breached_cases
                        }

                      </span>

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-700">

                      {
                        customer.reopened_cases
                      }

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-700">

                      {
                        customer.transfer_count
                      }

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-500">

                      {
                        customer.latest_complaint_date ??
                        "—"
                      }

                    </td>

                  </tr>

                ),
              )}

            </tbody>

          </table>

        </div>


        {loading && (

          <div className="p-10 text-center text-sm text-slate-500">
            Loading customers...
          </div>

        )}


        {!loading &&
          customers.length ===
            0 && (

            <div className="p-10 text-center text-sm text-slate-500">
              No customer accounts found.
            </div>

          )}

      </div>


      {/* FOOTER */}

      <div className="text-sm text-slate-500">

        Showing{" "}

        <span className="font-semibold text-slate-700">
          {customers.length}
        </span>

        {" "}of{" "}

        <span className="font-semibold text-slate-700">
          {total.toLocaleString()}
        </span>

        {" "}customer accounts.

      </div>

    </div>
  )
}


function MetricCard({
  title,
  value,
  icon: Icon,
  danger = false,
}: {
  title: string
  value: string
  icon: typeof Users
  danger?: boolean
}) {

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              danger
                ? "text-red-700"
                : "text-slate-900"
            }`}
          >
            {value}
          </p>

        </div>


        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            danger
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >

          <Icon className="h-5 w-5" />

        </div>

      </div>

    </div>
  )
}


export default Customers