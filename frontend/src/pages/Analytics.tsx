import {
  AlertTriangle,
  BarChart3,
  Clock3,
  Database,
  DollarSign,
  Gauge,
  Phone,
  RefreshCw,
  TrendingDown,
  TrendingUp,
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
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
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


const CHART_COLORS = [
  "#0f172a",
  "#334155",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#475569",
]


function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed)
    ? parsed
    : 0
}


function text(
  row: JsonRecord,
  keys: string[],
): string {
  for (const key of keys) {
    if (row[key] != null) {
      return String(row[key])
    }
  }

  return "Unknown"
}


function value(
  row: JsonRecord,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (row[key] != null) {
      return row[key]
    }
  }

  return undefined
}


function pct(input: unknown): string {
  const n = num(input)

  return `${(
    n <= 1 ? n * 100 : n
  ).toFixed(1)}%`
}


function Analytics() {
  const [data, setData] =
    useState<DashboardSummary | null>(null)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

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

  const overall = data?.overall ?? {}

  const monthly = useMemo(
    () =>
      (data?.monthly ?? []).map((row) => ({
        month: text(row, [
          "month",
          "period",
        ]),
        opened: num(
          value(row, [
            "complaints_opened",
            "opened",
          ]),
        ),
        closed: num(
          value(row, [
            "complaints_closed",
            "closed",
          ]),
        ),
        backlog: num(
          value(row, ["backlog"]),
        ),
        resolution: num(
          value(row, [
            "avg_days_to_close",
            "average_days_to_close",
          ]),
        ),
        fcr: num(
          value(row, [
            "first_contact_resolution_rate",
          ]),
        ),
        calls: num(
          value(row, [
            "inbound_calls",
          ]),
        ),
        cost: num(
          value(row, [
            "cost_to_serve_per_account",
          ]),
        ),
        regulator: num(
          value(row, [
            "regulator_satisfaction_score",
          ]),
        ),
      })),
    [data],
  )

  const regions = useMemo(
    () =>
      (data?.by_region ?? []).map((row) => ({
        name: text(row, ["region"]),
        complaints: num(
          value(row, ["complaints"]),
        ),
        breach: num(
          value(row, ["sla_breach_rate"]),
        ),
        resolution: num(
          value(row, [
            "average_days_to_close",
          ]),
        ),
      })),
    [data],
  )

  const categories = useMemo(
    () =>
      (data?.by_category ?? []).map((row) => ({
        name: text(row, ["category"]),
        complaints: num(
          value(row, ["complaints"]),
        ),
        breach: num(
          value(row, ["sla_breach_rate"]),
        ),
        share: num(
          value(row, ["share"]),
        ),
      })),
    [data],
  )

  const priorities = useMemo(
    () =>
      (data?.by_priority ?? []).map((row) => ({
        name: text(row, ["priority"]),
        complaints: num(
          value(row, ["complaints"]),
        ),
        breach: num(
          value(row, ["sla_breach_rate"]),
        ),
      })),
    [data],
  )

  const channels = useMemo(
    () =>
      (data?.by_channel ?? []).map((row) => ({
        name: text(row, ["channel"]),
        complaints: num(
          value(row, ["complaints"]),
        ),
        breach: num(
          value(row, ["sla_breach_rate"]),
        ),
      })),
    [data],
  )

  const latest =
    monthly[monthly.length - 1]

  const previous =
    monthly.length > 1
      ? monthly[monthly.length - 2]
      : latest

  if (loading && !data) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading analytics...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-slate-700" />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Analytics
            </h1>
          </div>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            Operational trends and breakdowns calculated locally
            from the Northwind datasets.
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

      {/* KPI ROW */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total complaints"
          value={num(
            overall.total_complaints,
          ).toLocaleString()}
          description="Reporting-period complaint volume"
          icon={<Database className="h-5 w-5" />}
        />

        <MetricCard
          title="Average resolution"
          value={`${num(
            overall.average_days_to_close,
          ).toFixed(1)} days`}
          description={`Latest month: ${num(
            latest?.resolution,
          ).toFixed(1)} days`}
          icon={<Clock3 className="h-5 w-5" />}
          variant="warning"
        />

        <MetricCard
          title="SLA breach rate"
          value={pct(
            overall.sla_breach_rate,
          )}
          description="Recorded breach share"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="danger"
        />

        <MetricCard
          title="Latest FCR"
          value={`${Math.round(
            num(latest?.fcr) * 100,
          )}%`}
          description={`Previous month: ${Math.round(
            num(previous?.fcr) * 100,
          )}%`}
          icon={<Gauge className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* MONTHLY VOLUME */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-slate-900">
            Complaint volume and backlog
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monthly opened, closed and cumulative backlog.
          </p>
        </div>

        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
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
                yAxisId="left"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Bar
                yAxisId="left"
                dataKey="opened"
                name="Opened"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                yAxisId="left"
                dataKey="closed"
                name="Closed"
                radius={[5, 5, 0, 0]}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="backlog"
                name="Backlog"
                strokeWidth={3}
                dot={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* RESOLUTION + FCR */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Resolution performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Average days required to close complaints.
              </p>
            </div>

            <Clock3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
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
                  name="Resolution days"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                First-contact resolution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Share of cases resolved without repeat contact.
              </p>
            </div>

            {num(latest?.fcr) >= num(previous?.fcr) ? (
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-amber-600" />
            )}
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
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
                  domain={[0, 1]}
                  tickFormatter={(v) =>
                    `${Math.round(
                      Number(v) * 100,
                    )}%`
                  }
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(v) =>
                    `${Math.round(
                      Number(v) * 100,
                    )}%`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="fcr"
                  name="FCR"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* REGULATOR + COST */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Regulator satisfaction
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monthly score against the 4.0 reference target.
              </p>
            </div>

            <TrendingDown className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
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
                  domain={[0, 5]}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <ReferenceLine
                  y={4}
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                />

                <Line
                  type="monotone"
                  dataKey="regulator"
                  name="Regulator score"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-slate-500">
            Latest:{" "}
            <span className="font-semibold text-slate-900">
              {num(
                latest?.regulator,
              ).toFixed(1)}{" "}
              / 5
            </span>
          </p>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Contact-centre economics
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest monthly operational indicators.
              </p>
            </div>

            <DollarSign className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <SignalCard
              title="Inbound calls"
              value={num(
                latest?.calls,
              ).toLocaleString()}
              description="Latest monthly volume"
              icon={<Phone className="h-5 w-5" />}
            />

            <SignalCard
              title="Cost to serve"
              value={`$${num(
                latest?.cost,
              ).toFixed(2)}`}
              description="Per-account reference"
              icon={<DollarSign className="h-5 w-5" />}
            />
          </div>
        </section>
      </div>

      {/* CATEGORY + PRIORITY */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Complaint categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Volume and SLA breach exposure by category.
            </p>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categories.slice(0, 9)}
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
                  width={170}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip />

                <Bar
                  dataKey="complaints"
                  name="Complaints"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Priority distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complaint volume and breach rate by priority.
            </p>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorities}
                  dataKey="complaints"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {priorities.map(
                    (priority, index) => (
                      <Cell
                        key={priority.name}
                        fill={
                          CHART_COLORS[
                            index %
                              CHART_COLORS.length
                          ]
                        }
                      />
                    ),
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {priorities.map((priority) => (
              <div
                key={priority.name}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-slate-600">
                  {priority.name}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {priority.complaints.toLocaleString()}
                  </span>

                  <span className="text-xs text-slate-500">
                    {pct(priority.breach)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* REGIONAL + CHANNEL */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="font-semibold text-slate-900">
              Regional performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complaint volume, breach rate and average resolution.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Region
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Complaints
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SLA
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Avg days
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {regions.map((region) => (
                  <tr key={region.name}>
                    <td className="px-5 py-3 font-medium text-slate-700">
                      {region.name}
                    </td>

                    <td className="px-5 py-3 text-right text-slate-700">
                      {region.complaints.toLocaleString()}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          region.breach >= 0.5
                            ? "text-red-600"
                            : "text-slate-700"
                        }`}
                      >
                        {pct(region.breach)}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-right text-slate-700">
                      {region.resolution.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Customer channels
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complaint volume and SLA exposure by channel.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {channels.map((channel) => (
              <div
                key={channel.name}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {channel.name}
                  </p>

                  <span className="text-sm font-semibold text-slate-700">
                    {channel.complaints.toLocaleString()}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-800"
                    style={{
                      width: `${Math.min(
                        channel.complaints /
                          Math.max(
                            ...channels.map(
                              (item) =>
                                item.complaints,
                            ),
                          ) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  SLA breach rate:{" "}
                  <span className="font-semibold text-slate-700">
                    {pct(channel.breach)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}


function MetricCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  variant?: "default" | "warning" | "danger" | "success"
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    success: "bg-emerald-100 text-emerald-700",
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}


function SignalCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}


export default Analytics
