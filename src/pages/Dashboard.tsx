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

import { useNavigate } from "react-router-dom"

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
  categoryData,
  complaints,
  dashboardMetrics,
  monthlyMetrics,
  resolutionData,
} from "../data/mockData"

function Dashboard() {
  const navigate = useNavigate()

  const priorityComplaints = [...complaints]
    .filter(
      (complaint) =>
        complaint.priority === "Critical" ||
        complaint.priority === "High" ||
        complaint.slaRisk >= 0.8,
    )
    .sort((a, b) => b.slaRisk - a.slaRisk)
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-slate-700" />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Complaint Operations
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Monitor backlog, SLA risk, resolution performance, and operational pressure.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          View all complaints
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Open complaints"
          value={dashboardMetrics.openComplaints.toLocaleString()}
          description="Current unresolved backlog"
          icon={FileWarning}
          variant="danger"
          onClick={() => navigate("/complaints")}
        />

        <KPICard
          title="Average resolution"
          value={`${dashboardMetrics.averageResolutionDays} days`}
          description={`Previous level: ${dashboardMetrics.previousResolutionDays} days`}
          icon={Clock3}
          variant="warning"
        />

        <KPICard
          title="SLA breach risk"
          value={`${dashboardMetrics.slaBreachRisk}%`}
          description="Complaints at risk of breach"
          icon={AlertTriangle}
          variant="danger"
        />

        <KPICard
          title="Regulator score"
          value={`${dashboardMetrics.regulatorScore} / 5`}
          description={`Target: ${dashboardMetrics.regulatorTarget}+`}
          icon={TrendingDown}
          variant="warning"
        />
      </div>

      {/* ALERT */}
      <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-red-900">
            Backlog requires immediate attention
          </p>

          <p className="mt-1 text-sm leading-6 text-red-800">
            {dashboardMetrics.slaBreachRisk}% of complaints are currently at
            risk of breaching their SLA. Prioritize high-risk cases before
            they escalate further.
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

      {/* CHARTS */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* COMPLAINT VOLUME */}
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
              24 months
            </div>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyMetrics}>
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
                  dataKey="complaintsOpened"
                  name="Opened"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="complaintsClosed"
                  name="Closed"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORIES */}
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
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {categoryData.map((category, index) => (
                    <Cell
                      key={`category-${category.name}`}
                      fill={
                        [
                          "#0f172a",
                          "#334155",
                          "#64748b",
                          "#94a3b8",
                          "#cbd5e1",
                        ][index % 5]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {categoryData.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-slate-600">
                  {category.name}
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {category.value}
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
            Latest: {dashboardMetrics.averageResolutionDays} days
          </div>
        </div>

        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyMetrics}>
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

              <ReferenceLine
                y={dashboardMetrics.previousResolutionDays}
                stroke="#94a3b8"
                strokeDasharray="5 5"
              />

              <Line
                type="monotone"
                dataKey="resolutionDays"
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
          value={dashboardMetrics.inboundCalls.toLocaleString()}
          description="Latest monthly volume"
        />

        <OperationalMetric
          title="First-contact resolution"
          value={`${Math.round(
            dashboardMetrics.firstContactResolutionRate * 100,
          )}%`}
          description="Cases resolved without repeat contact"
        />

        <OperationalMetric
          title="Cost to serve"
          value={`$${dashboardMetrics.costToServePerAccount.toFixed(2)}`}
          description="Average cost per account"
        />
      </div>

      {/* FCR + REGULATOR */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* FCR */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              First-contact resolution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Trend in complaints resolved without repeat contact
            </p>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyMetrics}>
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
                  tickFormatter={(value) =>
                    `${Math.round(value * 100)}%`
                  }
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(value) =>
                    `${Math.round(Number(value) * 100)}%`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="firstContactResolutionRate"
                  name="FCR"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REGULATOR */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Regulator satisfaction
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Score trend against the 4.0 target
            </p>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyMetrics}>
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
                  y={dashboardMetrics.regulatorTarget}
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
              Cases requiring immediate attention
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {priorityComplaints.length > 0 ? (
          <div className="divide-y">
            {priorityComplaints.map((complaint) => (
              <button
                key={complaint.id}
                type="button"
                onClick={() =>
                  navigate(`/complaints/${complaint.id}`)
                }
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-900">
                      {complaint.id}
                    </p>

                    <PriorityBadge
                      priority={complaint.priority}
                    />
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {complaint.customerName} ·{" "}
                    {complaint.category}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-red-600">
                    {Math.round(
                      complaint.slaRisk * 100,
                    )}
                    %
                  </p>

                  <p className="text-xs text-slate-400">
                    SLA risk
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />

            <p className="mt-3 font-medium text-slate-900">
              No high-priority complaints
            </p>

            <p className="mt-1 text-sm text-slate-500">
              The priority queue is currently clear.
            </p>
          </div>
        )}
      </div>

      {/* RESOLUTION + SIGNALS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RESOLUTION STATUS */}
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
            {resolutionData.map((item) => {
              const total = resolutionData.reduce(
                (sum, current) => sum + current.value,
                0,
              )

              const percentage =
                total > 0
                  ? Math.round((item.value / total) * 100)
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

        {/* OPERATIONAL SIGNALS */}
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
              value={`${dashboardMetrics.averageResolutionDays} days`}
              description={`Previous level: ${dashboardMetrics.previousResolutionDays} days`}
              type="warning"
            />

            <Signal
              title="SLA exposure"
              value={`${dashboardMetrics.slaBreachRisk}%`}
              description="Cases at risk of breach"
              type="danger"
            />

            <Signal
              title="Regulator score"
              value={`${dashboardMetrics.regulatorScore} / 5`}
              description={`Target: ${dashboardMetrics.regulatorTarget}+`}
              type="danger"
            />

            <Signal
              title="First-contact resolution"
              value={`${Math.round(
                dashboardMetrics.firstContactResolutionRate * 100,
              )}%`}
              description="Latest monthly FCR"
              type="warning"
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

export default Dashboard