import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Clock3,
  DollarSign,
  Gauge,
  Phone,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

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
  dashboardMetrics,
  monthlyMetrics,
} from "../data/mockData"

function Analytics() {
  const firstMonth = monthlyMetrics[0]
  const lastMonth =
    monthlyMetrics[monthlyMetrics.length - 1]

  const resolutionChange =
    lastMonth.resolutionDays - firstMonth.resolutionDays

  const fcrChange =
    (lastMonth.firstContactResolutionRate -
      firstMonth.firstContactResolutionRate) *
    100

  const regulatorChange =
    lastMonth.regulatorScore -
    firstMonth.regulatorScore

  const costChange =
    lastMonth.costToServePerAccount -
    firstMonth.costToServePerAccount

  const totalOpened = monthlyMetrics.reduce(
    (sum, item) => sum + item.complaintsOpened,
    0,
  )

  const totalClosed = monthlyMetrics.reduce(
    (sum, item) => sum + item.complaintsClosed,
    0,
  )

  const chartData = monthlyMetrics.map((item) => ({
    month: formatMonth(item.month),
    opened: item.complaintsOpened,
    closed: item.complaintsClosed,
    resolution: item.resolutionDays,
    fcr: Number(
      (item.firstContactResolutionRate * 100).toFixed(
        1,
      ),
    ),
    regulator: item.regulatorScore,
    cost: item.costToServePerAccount,
  }))

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Operational Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Two-year view of complaint performance,
          customer operations, and service pressure.
        </p>
      </div>

      {/* EXECUTIVE SIGNAL */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <ShieldAlert className="h-5 w-5 text-red-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-900">
              Operational deterioration is visible across
              multiple KPIs
            </p>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-red-800">
              Resolution time increased while first-contact
              resolution and regulator satisfaction declined.
              The analytics view helps identify the operational
              signals that should guide the intervention.
            </p>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Resolution time"
          value={`${lastMonth.resolutionDays} days`}
          description={`From ${firstMonth.resolutionDays} days`}
          icon={<Clock3 className="h-5 w-5" />}
          variant="danger"
          trend={
            resolutionChange >= 0
              ? `+${resolutionChange.toFixed(1)} days`
              : `${resolutionChange.toFixed(1)} days`
          }
          trendUp={resolutionChange >= 0}
        />

        <MetricCard
          title="First-contact resolution"
          value={`${(
            lastMonth.firstContactResolutionRate * 100
          ).toFixed(1)}%`}
          description={`From ${(firstMonth.firstContactResolutionRate * 100).toFixed(1)}%`}
          icon={<Gauge className="h-5 w-5" />}
          variant="warning"
          trend={`${fcrChange >= 0 ? "+" : ""}${fcrChange.toFixed(1)} pts`}
          trendUp={fcrChange >= 0}
        />

        <MetricCard
          title="Regulator score"
          value={`${lastMonth.regulatorScore.toFixed(2)}/5`}
          description={`Target ${dashboardMetrics.regulatorTarget.toFixed(1)}/5`}
          icon={<ShieldAlert className="h-5 w-5" />}
          variant="danger"
          trend={`${regulatorChange >= 0 ? "+" : ""}${regulatorChange.toFixed(2)} pts`}
          trendUp={regulatorChange >= 0}
        />

        <MetricCard
          title="Cost to serve"
          value={`$${lastMonth.costToServePerAccount.toFixed(2)}`}
          description={`From $${firstMonth.costToServePerAccount.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5" />}
          variant="warning"
          trend={`${costChange >= 0 ? "+" : ""}$${costChange.toFixed(2)}`}
          trendUp={costChange >= 0}
        />
      </div>

      {/* COMPLAINT VOLUME */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-500" />

              <h2 className="font-semibold text-slate-900">
                Complaint volume
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Complaints opened versus closed each month.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-900">
              {totalOpened.toLocaleString()}
            </span>{" "}
            opened ·{" "}
            <span className="font-semibold text-slate-900">
              {totalClosed.toLocaleString()}
            </span>{" "}
            closed
          </div>
        </div>

        <div className="mt-6 h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                interval={2}
              />

              <YAxis
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="opened"
                name="Opened"
                fill="#334155"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="closed"
                name="Closed"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* PERFORMANCE */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RESOLUTION */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-slate-500" />

              <h2 className="font-semibold text-slate-900">
                Resolution performance
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Average days required to close complaints.
            </p>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  interval={2}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="resolution"
                  name="Days to close"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3">
            <TrendingUp className="h-4 w-4 text-red-600" />

            <p className="text-xs font-medium text-red-800">
              Resolution time increased by{" "}
              {resolutionChange.toFixed(1)} days over the
              period.
            </p>
          </div>
        </section>

        {/* FCR */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-500" />

              <h2 className="font-semibold text-slate-900">
                First-contact resolution
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Share of complaints resolved without further
              contact.
            </p>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  interval={2}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[0, 70]}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `${value}%`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="fcr"
                  name="FCR"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3">
            <TrendingDown className="h-4 w-4 text-amber-600" />

            <p className="text-xs font-medium text-amber-800">
              FCR changed by{" "}
              {fcrChange >= 0 ? "+" : ""}
              {fcrChange.toFixed(1)} percentage points.
            </p>
          </div>
        </section>
      </div>

      {/* REGULATOR + COST */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* REGULATOR */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Regulator satisfaction
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Monthly regulator score out of five.
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">
                {lastMonth.regulatorScore.toFixed(2)}
              </p>

              <p className="text-[11px] text-slate-400">
                Target {dashboardMetrics.regulatorTarget.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  interval={2}
                />

                <YAxis
                  domain={[2, 5]}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="regulator"
                  name="Regulator score"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* COST */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Cost to serve
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Monthly cost per account.
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                ${lastMonth.costToServePerAccount.toFixed(2)}
              </p>

              <p className="text-[11px] text-slate-400">
                Current
              </p>
            </div>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  interval={2}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    `$${value}`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `$${Number(value).toFixed(2)}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Cost per account"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* OPERATIONAL SIGNALS */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />

          <h2 className="font-semibold text-slate-900">
            Operational signals
          </h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <SignalCard
            title="Complaint backlog"
            value={`${dashboardMetrics.openComplaints.toLocaleString()} open`}
            description="Large unresolved workload remains in the operation."
            variant="danger"
          />

          <SignalCard
            title="Customer contact pressure"
            value={`${lastMonth.inboundCalls.toLocaleString()} calls`}
            description="Inbound call volume is materially above the starting period."
            variant="warning"
          />

          <SignalCard
            title="Service performance"
            value={`${lastMonth.resolutionDays} days`}
            description="Average resolution time is substantially above the starting period."
            variant="danger"
          />
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon,
  variant,
  trend,
  trendUp,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  variant: "default" | "warning" | "danger"
  trend: string
  trendUp: boolean
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
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

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>

      <div
        className={`mt-4 flex items-center gap-1 text-xs font-semibold ${
          trendUp
            ? "text-red-600"
            : "text-emerald-600"
        }`}
      >
        {trendUp ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )}

        {trend}
      </div>
    </div>
  )
}

function SignalCard({
  title,
  value,
  description,
  variant,
}: {
  title: string
  value: string
  description: string
  variant: "warning" | "danger"
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        variant === "danger"
          ? "border-red-200 bg-red-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${
          variant === "danger"
            ? "text-red-700"
            : "text-amber-700"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  )
}

function formatMonth(value: string) {
  const [year, month] = value.split("-")

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1,
  )

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}

export default Analytics