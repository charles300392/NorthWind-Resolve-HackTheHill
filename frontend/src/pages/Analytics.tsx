import {
  AlertTriangle,
  Clock3,
  Database,
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


function num(
  value: unknown,
) {

  const n =
    Number(value)

  return Number.isFinite(n)
    ? n
    : 0
}


function text(
  row: JsonRecord,
  keys: string[],
) {

  for (
    const key of keys
  ) {

    if (
      row[key] != null
    ) {

      return String(
        row[key],
      )
    }
  }

  return "Unknown"
}


function value(
  row: JsonRecord,
  keys: string[],
) {

  for (
    const key of keys
  ) {

    if (
      row[key] != null
    ) {

      return row[key]
    }
  }

  return undefined
}


function pct(
  input: unknown,
) {

  const n =
    num(input)

  return `${
    (
      n <= 1
        ? n * 100
        : n
    ).toFixed(1)
  }%`
}


function Analytics() {

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

      setData(
        await getDashboardSummary(),
      )

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load analytics",
      )

    } finally {

      setLoading(false)
    }
  }


  useEffect(() => {

    void load()

  }, [])


  const monthly =
    useMemo(
      () =>
        (
          data?.monthly ?? []
        ).map(
          (row) => ({

            month: text(
              row,
              [
                "month",
                "period",
              ],
            ),

            resolution:
              num(
                value(
                  row,
                  [
                    "avg_days_to_close",
                    "average_days_to_close",
                    "resolution_days",
                  ],
                ),
              ),

            opened:
              num(
                value(
                  row,
                  [
                    "complaints_opened",
                    "opened",
                    "complaints",
                  ],
                ),
              ),

            closed:
              num(
                value(
                  row,
                  [
                    "complaints_closed",
                    "closed",
                  ],
                ),
              ),

          }),
        ),
      [data],
    )


  const overall =
    data?.overall ?? {}


  const latest =
    monthly[
      monthly.length - 1
    ]


  const previous =
    monthly[
      monthly.length - 2
    ]


  return (

    <div className="space-y-6">

      <div className="flex items-end justify-between">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Operational performance from the local Northwind analytics layer.
          </p>

        </div>


        <button
          onClick={() =>
            void load()
          }
          className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm"
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
          Loading analytics...
        </div>

      ) : (

        <>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <Card
              title="Total complaints"
              value={num(
                overall.total_complaints,
              ).toLocaleString()}
              icon={Database}
            />

            <Card
              title="SLA breach rate"
              value={pct(
                overall.sla_breach_rate,
              )}
              icon={AlertTriangle}
              danger
            />

            <Card
              title="Average days to close"
              value={
                overall.average_days_to_close ==
                null
                  ? "—"
                  : `${num(
                      overall.average_days_to_close,
                    ).toFixed(1)} d`
              }
              icon={Clock3}
            />

            <Card
              title="Latest resolution"
              value={
                latest
                  ? `${latest.resolution.toFixed(
                      1,
                    )} d`
                  : "—"
              }
              icon={Clock3}
            />

          </div>


          <div className="grid gap-6 xl:grid-cols-2">

            <Chart
              title="Resolution time"
              subtitle="Monthly average days to close"
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

            </Chart>


            <Chart
              title="Complaint volume"
              subtitle="Opened vs closed each month"
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

            </Chart>

          </div>


          <div className="grid gap-4 md:grid-cols-3">

            <Indicator
              title="Resolution trend"
              value={
                latest &&
                previous
                  ? `${(
                      latest.resolution -
                      previous.resolution
                    ).toFixed(1)} d`
                  : "—"
              }
              description="Change vs previous month"
            />


            <Indicator
              title="First-contact resolution"
              value={
                latest
                  ? pct(
                      value(
                        data?.monthly?.[
                          data.monthly.length - 1
                        ] ?? {},
                        [
                          "first_contact_resolution_rate",
                        ],
                      ),
                    )
                  : "—"
              }
              description="Latest monthly KPI"
            />


            <Indicator
              title="Regulator score"
              value={
                latest
                  ? String(
                      value(
                        data?.monthly?.[
                          data.monthly.length - 1
                        ] ?? {},
                        [
                          "regulator_satisfaction_score_of_5",
                        ],
                      ) ?? "—",
                    )
                  : "—"
              }
              description="Latest monthly KPI"
            />

          </div>

        </>

      )}

    </div>
  )
}


function Card({
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

      <div className="flex justify-between">

        <div>

          <p className="text-sm text-slate-500">
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


        <Icon
          className={`h-5 w-5 ${
            danger
              ? "text-red-600"
              : "text-slate-500"
          }`}
        />

      </div>

    </div>
  )
}


function Chart({
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


function Indicator({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {

  return (

    <div className="rounded-xl border bg-slate-50 p-5">

      <p className="text-sm font-medium text-slate-700">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>

    </div>
  )
}


export default Analytics