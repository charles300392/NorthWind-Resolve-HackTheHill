import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileWarning,
  TrendingDown,
  TrendingUp,
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

import KPICard from "../components/dashboard/KPICard"

import {
  getComplaints,
  getDashboardSummary,
} from "../services/api"

import type {
  Complaint,
  DashboardSummary,
  JsonRecord,
} from "../types/api"


const CATEGORY_COLORS = [
  "#0f172a",
  "#334155",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#475569",
  "#1e293b",
  "#7c8798",
  "#a8b1bd",
]


function numberValue(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}


function textValue(
  value: unknown,
  fallback = "Unknown",
): string {
  return value === null ||
    value === undefined ||
    value === ""
    ? fallback
    : String(value)
}


function firstValue(
  row: JsonRecord,
  keys: string[],
): unknown {
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


function formatPercent(value: unknown): string {
  const n = numberValue(value)

  return `${(
    n <= 1
      ? n * 100
      : n
  ).toFixed(1)}%`
}


function Dashboard() {
  const navigate = useNavigate()

  const [data, setData] =
    useState<DashboardSummary | null>(null)

  const [priorityComplaints, setPriorityComplaints] =
    useState<Complaint[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")

    try {
      const [summary, complaintResponse] =
        await Promise.all([
          getDashboardSummary(),
          getComplaints({
            limit: 200,
            offset: 0,
          }),
        ])

      setData(summary)

      const prioritized =
        complaintResponse.items
          .filter(
            (complaint) =>
              complaint.sla_breach === 1 ||
              String(complaint.priority).toLowerCase() === "p1",
          )
          .sort(
            (a, b) =>
              Number(b.sla_breach) -
              Number(a.sla_breach),
          )
          .slice(0, 6)

      setPriorityComplaints(prioritized)
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

  const overall = data?.overall ?? {}

  const monthly = useMemo(
    () =>
      (data?.monthly ?? []).map((row) => ({
        month: textValue(
          firstValue(row, ["month", "period"]),
        ),
        opened: numberValue(
          firstValue(row, [
            "complaints_opened",
            "opened",
            "complaints",
          ]),
        ),
        closed: numberValue(
          firstValue(row, [
            "complaints_closed",
            "closed",
          ]),
        ),
        backlog: numberValue(
          firstValue(row, ["backlog"]),
        ),
        resolution: numberValue(
          firstValue(row, [
            "avg_days_to_close",
            "average_days_to_close",
            "resolution_days",
          ]),
        ),
        fcr: numberValue(
          firstValue(row, [
            "first_contact_resolution_rate",
            "fcr",
          ]),
        ),
        inboundCalls: numberValue(
          firstValue(row, [
            "inbound_calls",
          ]),
        ),
        costToServe: numberValue(
          firstValue(row, [
            "cost_to_serve_per_account",
          ]),
        ),
        regulatorScore: numberValue(
          firstValue(row, [
            "regulator_satisfaction_score",
            "regulator_satisfaction_score_of_5",
          ]),
        ),
      })),
    [data],
  )

  const categories = useMemo(
    () =>
      (data?.by_category ?? []).map((row) => ({
        name: textValue(
          firstValue(row, [
            "category",
            "name",
            "label",
          ]),
        ),
        value: numberValue(
          firstValue(row, [
            "complaints",
            "count",
            "total",
            "value",
          ]),
        ),
      })),
    [data],
  )

  const resolutionStatus = useMemo(() => {
    const closed = numberValue(
      overall.closed_complaints,
    )

    const open = numberValue(
      overall.open_complaints,
    )

    return [
      {
        name: "Closed",
        value: closed,
      },
      {
        name: "Open",
        value: open,
      },
    ]
  }, [overall])

  const latestMonth =
    monthly[monthly.length - 1]

  const totalComplaints =
    numberValue(overall.total_complaints)

  const breachRate =
    numberValue(overall.sla_breach_rate)

  const averageResolution =
    numberValue(
      overall.average_days_to_close,
    )

  const openBacklog =
    numberValue(overall.open_complaints)

  const latestFcr =
    latestMonth?.fcr ?? 0

  const latestInboundCalls =
    latestMonth?.inboundCalls ?? 0

  const latestCostToServe =
    latestMonth?.costToServe ?? 0

  const latestRegulatorScore =
    latestMonth?.regulatorScore ?? 0

  const previousResolution =
    monthly.length > 1
      ? monthly[monthly.length - 2]?.resolution ?? 0
      : averageResolution

  const previousFcr =
    monthly.length > 1
      ? monthly[monthly.length - 2]?.fcr ?? latestFcr
      : latestFcr

  if (loading && !data) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading complaint operations...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-slate-700" />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Complaint Operations
            </h1>
          </div>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor backlog, SLA exposure, resolution performance,
            customer-contact volume and operational pressure.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          View all complaints
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Backend error: {error}
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total complaints"
          value={totalComplaints.toLocaleString()}
          description="Complaints in the reporting dataset"
          icon={FileWarning}
          onClick={() => navigate("/complaints")}
        />

        <KPICard
          title="SLA breach rate"
          value={formatPercent(breachRate)}
          description="Complaints with an SLA breach recorded"
          icon={AlertTriangle}
          variant="danger"
          onClick={() => navigate("/complaints")}
        />

        <KPICard
          title="Average resolution"
          value={`${averageResolution.toFixed(1)} days`}
          description={`Previous month: ${previousResolution.toFixed(1)} days`}
          icon={Clock3}
          variant="warning"
        />

        <KPICard
          title="Open backlog"
          value={openBacklog.toLocaleString()}
          description="Complaints not currently closed"
          icon={BarChart3}
          variant="warning"
        />
      </div>

      {/* OPERATIONAL ALERT */}
      <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-red-900">
            SLA exposure requires attention
          </p>

          <p className="mt-1 text-sm leading-6 text-red-800">
            {formatPercent(breachRate)} of complaints have a recorded
            SLA breach. Use the complaint queue to review the affected
            cases and prioritize operational follow-up.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Review queue
        </button>
      </div>

      {/* VOLUME + CATEGORIES */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Complaint volume
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monthly complaints opened and closed
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <TrendingUp className="h-3.5 w-3.5" />
              {monthly.length} months
            </div>
          </div>

          <div className="mt-6 h-72">
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
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="opened"
                  name="Opened"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="closed"
                  name="Closed"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Complaint categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current workload distribution
            </p>
          </div>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {categories.map((category, index) => (
                    <Cell
                      key={category.name}
                      fill={
                        CATEGORY_COLORS[
                          index % CATEGORY_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5">
            {categories.slice(0, 7).map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate text-xs text-slate-600">
                  {category.name}
                </span>

                <span className="shrink-0 text-xs font-semibold text-slate-900">
                  {category.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESOLUTION PERFORMANCE */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Resolution performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Average days required to close complaints
            </p>
          </div>

          <div className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
            Overall: {averageResolution.toFixed(1)} days
          </div>
        </div>

        <div className="mt-6 h-72">
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
                tick={{ fontSize: 11 }}
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
      </div>

      {/* OPERATIONAL METRICS */}
      <div className="grid gap-4 md:grid-cols-3">
        <OperationalMetric
          title="Inbound calls"
          value={latestInboundCalls.toLocaleString()}
          description="Latest monthly volume"
        />

        <OperationalMetric
          title="First-contact resolution"
          value={`${Math.round(
            latestFcr * 100,
          )}%`}
          description={`Previous month: ${Math.round(
            previousFcr * 100,
          )}%`}
        />

        <OperationalMetric
          title="Cost to serve"
          value={`$${latestCostToServe.toFixed(2)}`}
          description="Latest monthly cost per account"
        />
      </div>

      {/* FCR + REGULATOR */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                First-contact resolution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Trend in complaints resolved without repeat contact
              </p>
            </div>

            <TrendingUp className="h-5 w-5 text-slate-400" />
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
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  domain={[0, 1]}
                  tickFormatter={(v) =>
                    `${Math.round(Number(v) * 100)}%`
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
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Regulator satisfaction
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monthly score against the 4.0 reference target
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
                  tick={{ fontSize: 11 }}
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
                  dataKey="regulatorScore"
                  name="Regulator score"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-slate-500">
            Latest score:{" "}
            <span className="font-semibold text-slate-900">
              {latestRegulatorScore.toFixed(1)} / 5
            </span>
          </p>
        </div>
      </div>

      {/* PRIORITY QUEUE */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Priority queue
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Cases with recorded SLA breaches or highest priority.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/complaints")}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {priorityComplaints.length > 0 ? (
          <div className="divide-y">
            {priorityComplaints.map((complaint) => (
              <button
                key={complaint.complaint_id}
                type="button"
                onClick={() =>
                  navigate(
                    `/complaints/${complaint.complaint_id}`,
                  )
                }
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-900">
                      {complaint.complaint_id}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {complaint.priority}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {complaint.account_id} ·{" "}
                    {complaint.category}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-red-600">
                    {complaint.sla_breach === 1
                      ? "Breached"
                      : "Priority"}
                  </p>

                  <p className="text-xs text-slate-400">
                    SLA status
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />

            <p className="mt-3 font-medium text-slate-900">
              No surfaced priority cases
            </p>

            <p className="mt-1 text-sm text-slate-500">
              The current first page does not contain flagged cases.
            </p>
          </div>
        )}
      </div>

      {/* RESOLUTION + SIGNALS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Resolution status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current complaint distribution
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {resolutionStatus.map((item) => {
              const total =
                resolutionStatus.reduce(
                  (sum, current) =>
                    sum + current.value,
                  0,
                )

              const percentage =
                total > 0
                  ? Math.round(
                      (item.value / total) * 100,
                    )
                  : 0

              return (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>

                    <span className="text-sm text-slate-500">
                      {item.value.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-800 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Operational signals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Indicators requiring management attention
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <Signal
              title="Average resolution time"
              value={`${averageResolution.toFixed(1)} days`}
              description={`Previous month: ${previousResolution.toFixed(1)} days`}
              type="warning"
            />

            <Signal
              title="SLA exposure"
              value={formatPercent(breachRate)}
              description="Complaints with a recorded SLA breach"
              type="danger"
            />

            <Signal
              title="Regulator score"
              value={`${latestRegulatorScore.toFixed(1)} / 5`}
              description="Latest monthly score"
              type="warning"
            />

            <Signal
              title="First-contact resolution"
              value={`${Math.round(
                latestFcr * 100,
              )}%`}
              description="Latest monthly FCR"
              type="success"
            />
          </div>
        </div>
      </div>
    </div>
  )
}


function OperationalMetric({
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

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  )
}


function Signal({
  title,
  value,
  description,
  type,
}: {
  title: string
  value: string
  description: string
  type: "warning" | "danger" | "success"
}) {
  const styles = {
    warning: {
      Icon: Clock3,
      container: "border-amber-100 bg-amber-50",
      iconContainer: "bg-amber-100",
      iconColor: "text-amber-600",
      value: "text-amber-700",
    },

    danger: {
      Icon: AlertTriangle,
      container: "border-red-100 bg-red-50",
      iconContainer: "bg-red-100",
      iconColor: "text-red-600",
      value: "text-red-700",
    },

    success: {
      Icon: CheckCircle2,
      container: "border-green-100 bg-green-50",
      iconContainer: "bg-green-100",
      iconColor: "text-green-600",
      value: "text-green-700",
    },
  }

  const currentStyle = styles[type]
  const Icon = currentStyle.Icon

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-4 ${currentStyle.container}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${currentStyle.iconContainer}`}
      >
        <Icon
          className={`h-5 w-5 ${currentStyle.iconColor}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-600">
          {title}
        </p>

        <p
          className={`mt-1 text-xl font-bold ${currentStyle.value}`}
        >
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}


export default Dashboard
