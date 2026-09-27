import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  DollarSign,
  Gauge,
  Phone,
  ShieldAlert,
  Target,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  getAIPilotSummary,
  getDashboardSummary,
  getUnitCosts,
} from "../services/api"

import type {
  DashboardSummary,
} from "../types/api"


function ValueCase() {
  const [data, setData] =
    useState<DashboardSummary | null>(null)

  const [unitCosts, setUnitCosts] =
    useState<Record<string, number>>({})

  const [pilot, setPilot] =
    useState<Record<string, number | string>>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError("")

      try {
        const [
          summary,
          costs,
          pilotSummary,
        ] = await Promise.all([
          getDashboardSummary(),
          getUnitCosts(),
          getAIPilotSummary(),
        ])

        setData(summary)
        setUnitCosts(costs)
        setPilot(pilotSummary)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load value case",
        )
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const overall = data?.overall ?? {}

  const monthly = data?.monthly ?? []

  const latest =
    monthly[monthly.length - 1] ?? {}

  const metrics = useMemo(() => {
    const totalComplaints =
      Number(
        overall.total_complaints ?? 0,
      )

    const averageDays =
      Number(
        overall.average_days_to_close ?? 0,
      )

    const breachRate =
      Number(
        overall.sla_breach_rate ?? 0,
      )

    const openBacklog =
      Number(
        overall.open_complaints ?? 0,
      )

    const inboundCalls =
      Number(
        latest.inbound_calls ?? 0,
      )

    const fcr =
      Number(
        latest.first_contact_resolution_rate ?? 0,
      )

    const costToServe =
      Number(
        latest.cost_to_serve_per_account ?? 0,
      )

    return {
      totalComplaints,
      averageDays,
      breachRate,
      openBacklog,
      inboundCalls,
      fcr,
      costToServe,
    }
  }, [overall, latest])

  const callCost =
    unitCosts["Inbound call handled by agent"] ?? 7.4

  const complaintCost =
    unitCosts[
      "Complaint handled end to end (average)"
    ] ?? 68

  const transferredComplaintCost =
    unitCosts[
      "Complaint handled end to end (transferred between systems)"
    ] ?? 121

  const pilotCost =
    unitCosts[
      "AskNorthwind assistant pilot"
    ] ?? 640000

  const monitoringPenalty =
    unitCosts[
      "Regulator penalty, enhanced monitoring"
    ] ?? 2400000

  const annualCallCost =
    metrics.inboundCalls *
    12 *
    callCost

  const annualComplaintCost =
    metrics.totalComplaints *
    complaintCost

  /*
   * Illustrative levers from the business-case UI.
   * These are assumptions, not observed Northwind outcomes.
   */
  const fcrImprovement = 0.10
  const resolutionReduction = 0.25

  const estimatedAnnualBenefit =
    annualCallCost *
      fcrImprovement *
      0.20 +
    annualComplaintCost *
      resolutionReduction *
      0.12

  const implementationCost =
    pilotCost

  const paybackMonths =
    estimatedAnnualBenefit > 0
      ? implementationCost /
        estimatedAnnualBenefit *
        12
      : 0

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading value case...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Business Case
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Value Case
        </h1>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          Connect the operational findings to an illustrative
          value framework using the actual Northwind metrics and
          finance unit-cost references.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Backend error: {error}
        </div>
      )}

      {/* CURRENT PRESSURE */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ValueCard
          title="Complaint workload"
          value={metrics.totalComplaints.toLocaleString()}
          description="Complaints represented in the reporting dataset."
          icon={<Gauge className="h-5 w-5" />}
          variant="default"
        />

        <ValueCard
          title="Average resolution"
          value={`${metrics.averageDays.toFixed(1)} d`}
          description="Average time to close complaints."
          icon={<Clock3 className="h-5 w-5" />}
          variant="warning"
        />

        <ValueCard
          title="SLA breach rate"
          value={`${(
            metrics.breachRate * 100
          ).toFixed(1)}%`}
          description="Recorded SLA breach share."
          icon={<ShieldAlert className="h-5 w-5" />}
          variant="danger"
        />

        <ValueCard
          title="Open backlog"
          value={metrics.openBacklog.toLocaleString()}
          description="Complaints that are not currently closed."
          icon={<Phone className="h-5 w-5" />}
          variant="warning"
        />
      </div>

      {/* COST REFERENCES */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Operational cost references
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Finance and operations unit costs available in the local dataset.
            </p>
          </div>

          <DollarSign className="h-5 w-5 text-slate-400" />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CostMetric
            title="Inbound call"
            value={`$${callCost.toFixed(2)}`}
            subtitle="per handled call"
          />

          <CostMetric
            title="Complaint handling"
            value={`$${complaintCost.toFixed(2)}`}
            subtitle="average per complaint"
          />

          <CostMetric
            title="Transferred complaint"
            value={`$${transferredComplaintCost.toFixed(2)}`}
            subtitle="average per transferred complaint"
          />

          <CostMetric
            title="Pilot reference"
            value={`$${formatMoney(pilotCost)}`}
            subtitle="AskNorthwind annual reference"
          />
        </div>
      </section>

      {/* BENEFIT LEVERS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5 text-slate-600" />

            <h2 className="font-semibold text-slate-900">
              Illustrative benefit levers
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            <BenefitRow
              title="First-contact resolution"
              assumption="+10 pts"
              description="Illustrative improvement used to estimate reduced repeat-contact handling."
            />

            <BenefitRow
              title="Resolution time"
              assumption="-25%"
              description="Illustrative reduction from faster routing and better case preparation."
            />

            <BenefitRow
              title="Complaint handling"
              assumption="Risk-based"
              description="Surface high-exposure cases earlier and focus specialist capacity."
            />

            <BenefitRow
              title="Agent workflow"
              assumption="Less context switching"
              description="Bring relevant operational context into the agent workflow."
            />
          </div>
        </section>

        <section className="rounded-xl bg-slate-900 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-slate-300">
            Illustrative annual benefit
          </p>

          <p className="mt-3 text-4xl font-bold">
            ${formatMoney(estimatedAnnualBenefit)}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Directional calculation using observed workload/cost
            references and explicit improvement assumptions. This is
            not a forecast.
          </p>

          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Reference implementation cost
            </p>

            <p className="mt-2 text-2xl font-bold">
              ${formatMoney(implementationCost)}
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Illustrative payback
            </p>

            <p className="mt-2 text-2xl font-bold">
              {paybackMonths > 0
                ? `${paybackMonths.toFixed(1)} months`
                : "N/A"}
            </p>
          </div>
        </section>
      </div>

      {/* PILOT + RISK REFERENCE */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-slate-500" />

            <h2 className="font-semibold text-slate-900">
              Historical AI pilot reference
            </h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoMetric
              label="Pilot months"
              value={String(
                pilot.months ?? "—",
              )}
            />

            <InfoMetric
              label="Total sessions"
              value={
                pilot.total_sessions == null
                  ? "—"
                  : Number(
                      pilot.total_sessions,
                    ).toLocaleString()
              }
            />

            <InfoMetric
              label="Latest month"
              value={String(
                pilot.latest_month ?? "—",
              )}
            />

            <InfoMetric
              label="Assistant CSAT"
              value={
                pilot.assistant_csat_of_5 == null
                  ? "—"
                  : `${Number(
                      pilot.assistant_csat_of_5,
                    ).toFixed(1)} / 5`
              }
            />
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />

            <h2 className="font-semibold text-slate-900">
              Risk reference
            </h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The local finance dataset includes a reference value of{" "}
            <span className="font-semibold text-slate-900">
              ${formatMoney(monitoringPenalty)}
            </span>{" "}
            per quarter in breach for enhanced monitoring. This is
            a reference cost, not a claim that Northwind will incur it.
          </p>
        </section>
      </div>

      {/* ASSUMPTIONS */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-slate-500" />

          <h2 className="font-semibold text-slate-900">
            Assumptions
          </h2>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Assumption
                </th>

                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Value
                </th>

                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Why it matters
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 text-slate-700">
                  FCR improvement
                </td>

                <td className="px-4 py-3 font-semibold text-slate-900">
                  +10 pts
                </td>

                <td className="px-4 py-3 text-slate-500">
                  Reduces repeat customer contacts in the illustrative model.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 text-slate-700">
                  Resolution improvement
                </td>

                <td className="px-4 py-3 font-semibold text-slate-900">
                  -25%
                </td>

                <td className="px-4 py-3 text-slate-500">
                  Represents a directional handling-time improvement.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 text-slate-700">
                  Benefit realization
                </td>

                <td className="px-4 py-3 font-semibold text-slate-900">
                  Partial
                </td>

                <td className="px-4 py-3 text-slate-500">
                  Not every operational benefit is monetized.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 text-slate-700">
                  AI oversight
                </td>

                <td className="px-4 py-3 font-semibold text-slate-900">
                  Required
                </td>

                <td className="px-4 py-3 text-slate-500">
                  AI recommendations remain subject to operational review.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* RISKS */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

          <div className="flex-1">
            <h2 className="font-semibold text-amber-900">
              Downside and risks
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <RiskItem
                title="AI does not fix underlying process problems"
                description="Poor data, fragmented systems or unclear ownership can remain bottlenecks."
              />

              <RiskItem
                title="Pilot results need investigation"
                description="Historical pilot metrics should be examined before repeating the same approach."
              />

              <RiskItem
                title="Benefits may take time"
                description="Training, process change and adoption can delay realized value."
              />

              <RiskItem
                title="Human review remains important"
                description="High-risk complaints should retain appropriate agent and specialist oversight."
              />
            </div>
          </div>
        </div>
      </section>

      {/* DECISION FRAME */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Validation frame
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Operational measures to validate before scaling.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <DecisionCard
            title="Validate"
            description="Test whether triage reduces resolution time and repeat contact."
          />

          <DecisionCard
            title="Measure"
            description="Track FCR, SLA exposure, handling time, cost to serve and customer outcomes."
          />

          <DecisionCard
            title="Scale"
            description="Expand when measured operational outcomes and adoption support the business case."
          />
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-xl border bg-slate-50 p-5">
        <ArrowDown className="h-5 w-5 text-slate-500" />

        <p className="text-sm text-slate-600">
          Treat this business case as an analytical framework:
          observed Northwind metrics are separated from illustrative
          improvement assumptions.
        </p>
      </div>
    </div>
  )
}


function ValueCard({
  title,
  value,
  description,
  icon,
  variant,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  variant: "default" | "warning" | "danger"
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
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}


function CostMetric({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>
    </div>
  )
}


function InfoMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  )
}


function BenefitRow({
  title,
  assumption,
  description,
}: {
  title: string
  assumption: string
  description: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {assumption}
        </span>
      </div>
    </div>
  )
}


function RiskItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-amber-200 bg-white/60 p-4">
      <p className="text-sm font-semibold text-amber-900">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-amber-800">
        {description}
      </p>
    </div>
  )
}


function DecisionCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}


function formatMoney(value: number) {
  return Math.round(value).toLocaleString("en-CA")
}


export default ValueCase
