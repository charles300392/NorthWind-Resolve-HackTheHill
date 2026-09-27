import {
  AlertTriangle,
  BarChart3,
  Clock3,
  FileWarning,
  RefreshCw,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  getDashboardSummary,
} from "../services/api"

import type {
  DashboardSummary,
  JsonRecord,
} from "../types/api"


function numberValue(
  value: unknown,
): number {

  const parsed =
    Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : 0
}


function textValue(
  value: unknown,
  fallback = "Unknown",
) {

  return value === null ||
    value === undefined ||
    value === ""
    ? fallback
    : String(value)
}


function firstValue(
  row: JsonRecord,
  keys: string[],
) {

  for (const key of keys) {

    if (
      row[key] !== undefined &&
      row[key] !== null
    ) {

      return row[key]
    }
  }

  return undefined
}


function formatPercent(
  value: unknown,
) {

  const n =
    numberValue(value)

  return `${
    (
      n <= 1
        ? n * 100
        : n
    ).toFixed(1)
  }%`
}


function Dashboard() {

  const [
    data,
    setData,
  ] =
    useState<DashboardSummary | null>(
      null,
    )


  const [
    error,
    setError,
  ] =
    useState("")


  const [
    loading,
    setLoading,
  ] =
    useState(true)


  async function load() {

    setLoading(true)
    setError("")


    try {

      const result =
        await getDashboardSummary()

      setData(result)

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard",
      )

    } finally {

      setLoading(false)
    }
  }


  useEffect(() => {

    void load()

  }, [])


  const monthly =
    useMemo(() => {

      return (
        data?.monthly ?? []
      ).map((row) => ({

        month: textValue(
          firstValue(
            row,
            [
              "month",
              "period",
            ],
          ),
        ),

        opened: numberValue(
          firstValue(
            row,
            [
              "complaints_opened",
              "opened",
              "complaints",
            ],
          ),
        ),

        closed: numberValue(
          firstValue(
            row,
            [
              "complaints_closed",
              "closed",
            ],
          ),
        ),

        resolution:
          numberValue(
            firstValue(
              row,
              [
                "avg_days_to_close",
                "average_days_to_close",
                "resolution_days",
              ],
            ),
          ),
      }))

    }, [data])


  const categories =
    useMemo(() => {

      return (
        data?.by_category ?? []
      ).map((row) => ({

        name: textValue(
          firstValue(
            row,
            [
              "category",
              "name",
              "label",
              "key",
            ],
          ),
        ),

        value:
          numberValue(
            firstValue(
              row,
              [
                "count",
                "complaints",
                "total",
                "value",
              ],
            ),
          ),
      }))

    }, [data])


  const overall =
    data?.overall ?? {}


  const total =
    numberValue(
      overall.total_complaints,
    )


  const breachRate =
    overall.sla_breach_rate


  const avgClose =
    overall.average_days_to_close


  const open =
    firstValue(
      overall,
      [
        "open_complaints",
        "open_backlog",
        "open_cases",
      ],
    )


  return (

    <div className="space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Live operational view powered by the local Northwind data layer.
          </p>

        </div>


        <button
          type="button"
          onClick={() => void load()}
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


      {loading && !data ? (

        <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate-500">
          Loading dashboard…
        </div>

      ) : (

        <>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <Kpi
              title="Total complaints"
              value={total.toLocaleString()}
              icon={FileWarning}
            />

            <Kpi
              title="SLA breach rate"
              value={formatPercent(breachRate)}
              icon={AlertTriangle}
              danger
            />

            <Kpi
              title="Average days to close"
              value={
                avgClose === undefined
                  ? "—"
                  : `${numberValue(avgClose).toFixed(1)} d`
              }
              icon={Clock3}
            />

            <Kpi
              title="Open backlog"
              value={
                open === undefined
                  ? "—"
                  : numberValue(open).toLocaleString()
              }
              icon={BarChart3}
            />

          </div>


          <div className="grid gap-6 xl:grid-cols-2">

            <ChartCard
              title="Monthly complaint volume"
              subtitle="Complaints opened and closed"
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={monthly}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="opened"
                    name="Opened"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="closed"
                    name="Closed"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </ChartCard>


            <ChartCard
              title="Average resolution time"
              subtitle="Days to close over the reporting period"
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={monthly}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="resolution"
                    name="Days"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </ChartCard>

          </div>


          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Complaints by category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution returned by the backend analytics layer.
            </p>


            <div className="mt-6 h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={categories}
                  layout="vertical"
                  margin={{
                    left: 20,
                    right: 20,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    dataKey="name"
                    type="category"
                    width={160}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    name="Complaints"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </>

      )}

    </div>
  )
}


function Kpi({
  title,
  value,
  icon: Icon,
  danger = false,
}: {
  title: string
  value: string
  icon: typeof Clock3
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


function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>

      <div className="mt-6 h-72">
        {children}
      </div>

    </div>
  )
}


export default Dashboard