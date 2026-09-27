import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  DollarSign,
  ShieldAlert,
  Target,
} from "lucide-react"

function ValueCase() {
  const annualCallCost = 55830 * 12 * 7.4
  const annualComplaintCost = 1599 * 68
  const annualEnhancedMonitoring = 2400000 * 4

  const targetFcrImprovement = 0.1
  const targetResolutionReduction = 0.25

  const estimatedAnnualBenefit =
    annualCallCost * targetFcrImprovement * 0.2 +
    annualComplaintCost * targetResolutionReduction * 12

  const estimatedImplementationCost = 640000

  const estimatedPaybackMonths =
    (estimatedImplementationCost /
      Math.max(estimatedAnnualBenefit, 1)) *
    12

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          Business case
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Value Case
        </h1>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          A transparent view of the potential economics,
          assumptions, and downside of improving complaint
          operations.
        </p>
      </div>

      {/* IMPORTANT MESSAGE */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-4">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-900">
              This is an illustrative value case
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              Benefits are based on explicit assumptions rather
              than guaranteed outcomes. The build should be
              validated against Northwind&apos;s full operational
              and financial data before investment.
            </p>
          </div>
        </div>
      </div>

      {/* CURRENT PRESSURE */}
      <div>
        <div className="mb-4">
          <h2 className="font-semibold text-slate-900">
            Current operational pressure
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Indicative annualized exposure using current
            operating metrics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ValueCard
            title="Inbound call cost"
            value={`$${formatMoney(annualCallCost)}`}
            description="Annualized from current monthly call volume."
            icon={<DollarSign className="h-5 w-5" />}
            variant="danger"
          />

          <ValueCard
            title="Complaint workload"
            value={`$${formatMoney(annualComplaintCost)}`}
            description="Illustrative cost using current open backlog."
            icon={<Clock3 className="h-5 w-5" />}
            variant="warning"
          />

          <ValueCard
            title="Enhanced monitoring"
            value={`$${formatMoney(annualEnhancedMonitoring)}`}
            description="Annualized quarterly penalty exposure if breach persists."
            icon={<ShieldAlert className="h-5 w-5" />}
            variant="danger"
          />

          <ValueCard
            title="Pilot reference cost"
            value="$640K"
            description="Annual AskNorthwind pilot cost from the data pack."
            icon={<Target className="h-5 w-5" />}
            variant="default"
          />
        </div>
      </div>

      {/* BENEFITS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <ArrowDown className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Illustrative benefit levers
              </h2>

              <p className="text-xs text-slate-500">
                Conservative operating assumptions.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <BenefitRow
              title="First-contact resolution"
              assumption="+10 percentage points"
              description="Fewer repeat contacts and avoidable call handling."
            />

            <BenefitRow
              title="Resolution time"
              assumption="-25%"
              description="Faster routing and better case preparation."
            />

            <BenefitRow
              title="Complaint handling"
              assumption="Prioritize high-risk cases"
              description="Focus specialist capacity where SLA exposure is highest."
            />

            <BenefitRow
              title="Agent workflow"
              assumption="Reduce context switching"
              description="Surface relevant information before the agent acts."
            />
          </div>
        </section>

        {/* BENEFIT ESTIMATE */}
        <section className="rounded-xl bg-slate-900 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-slate-300">
            Illustrative annual benefit
          </p>

          <p className="mt-3 text-4xl font-bold">
            ${formatMoney(estimatedAnnualBenefit)}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Estimated from the stated assumptions. This is a
            directional business-case calculation, not a forecast.
          </p>

          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Reference implementation cost
            </p>

            <p className="mt-2 text-2xl font-bold">
              ${formatMoney(estimatedImplementationCost)}
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Illustrative payback
            </p>

            <p className="mt-2 text-2xl font-bold">
              {estimatedPaybackMonths < 12
                ? `${estimatedPaybackMonths.toFixed(1)} months`
                : `${(estimatedPaybackMonths / 12).toFixed(1)} years`}
            </p>
          </div>
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
                  Reduces repeat customer contacts.
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
                  Reduces operational handling time.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 text-slate-700">
                  Implementation reference
                </td>

                <td className="px-4 py-3 font-semibold text-slate-900">
                  $640K/year
                </td>

                <td className="px-4 py-3 text-slate-500">
                  Existing pilot cost used as a reference point.
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
                  Not every operational benefit is monetized here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* DOWNSIDE */}
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
                description="Poor data, fragmented systems, or unclear ownership can remain bottlenecks."
              />

              <RiskItem
                title="Pilot results need investigation"
                description="The previous AI pilot should be examined before repeating the same approach."
              />

              <RiskItem
                title="Benefits may take time"
                description="Operational change, training, and adoption can delay benefit realization."
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
          Investment decision frame
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          What should be validated before scaling the solution.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <DecisionCard
            title="Validate"
            description="Test whether triage actually reduces resolution time and repeat contact."
          />

          <DecisionCard
            title="Measure"
            description="Track FCR, SLA exposure, handling time, cost to serve, and regulator score."
          />

          <DecisionCard
            title="Scale"
            description="Expand only when operational outcomes and adoption support the business case."
          />
        </div>
      </section>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center gap-3 rounded-xl border bg-slate-50 p-5">
        <ArrowUp className="h-5 w-5 text-slate-500" />

        <p className="text-sm text-slate-600">
          The business case should be treated as a decision
          framework: validate the operational mechanism first,
          then scale the investment.
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