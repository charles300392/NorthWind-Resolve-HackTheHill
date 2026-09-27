import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  Send,
  ShieldAlert,
  User,
  Zap,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import CaseTimeline from "../components/case/CaseTimeline"

import {
  analyzeComplaint,
  getComplaint,
  getComplaintContext,
} from "../services/api"

import type {
  AIAnalysis,
  Complaint,
  ComplaintContext,
  JsonRecord,
} from "../types/api"


function value(
  record: JsonRecord | undefined,
  key: string,
  fallback = "—",
): string {
  const current = record?.[key]

  return current === undefined ||
    current === null ||
    current === ""
    ? fallback
    : String(current)
}


function percent(
  current: number | undefined,
): string {
  return current == null
    ? "—"
    : `${(
        current * 100
      ).toFixed(1)}%`
}


function ComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [complaint, setComplaint] =
    useState<Complaint | null>(null)

  const [context, setContext] =
    useState<ComplaintContext | null>(null)

  const [analysis, setAnalysis] =
    useState<AIAnalysis | null>(null)

  const [complaintText, setComplaintText] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  const [analyzing, setAnalyzing] =
    useState(false)

  const [error, setError] =
    useState("")

  useEffect(() => {
    if (!id) {
      return
    }

    setLoading(true)
    setError("")
    setAnalysis(null)

    Promise.all([
      getComplaint(id),
      getComplaintContext(id),
    ])
      .then(
        ([
          caseData,
          caseContext,
        ]) => {
          setComplaint(caseData)
          setContext(caseContext)
        },
      )
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load complaint",
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  async function runAI() {
    if (!complaintText.trim()) {
      setError(
        "Enter synthetic/demo complaint text before running AI analysis.",
      )
      return
    }

    setAnalyzing(true)
    setError("")

    try {
      /*
       * IMPORTANT:
       * Only the user-entered synthetic/demo complaint text
       * is sent to Gemini.
       *
       * Northwind CSV context is intentionally NOT sent.
       */
      const result = await analyzeComplaint({
        complaint_text:
          complaintText.trim(),
      })

      setAnalysis(result)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "AI analysis failed",
      )
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading complaint...
        </p>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to complaints
        </button>

        <div className="rounded-xl border bg-white p-10 text-center">
          Complaint not found.
        </div>
      </div>
    )
  }

  const history =
    context?.customer_history

  const staffing =
    context?.staffing

  const kpis =
    context?.monthly_kpis

  const sourceSystem =
    context?.source_system_context

  return (
    <div className="space-y-6">
      {/* BACK */}
      <button
        type="button"
        onClick={() => navigate("/complaints")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to complaints
      </button>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* CASE HEADER */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {complaint.complaint_id}
              </h1>

              <PriorityBadge
                priority={complaint.priority}
              />

              <StatusBadge
                status={complaint.status}
              />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {complaint.category} ·{" "}
              {complaint.region} ·{" "}
              {complaint.channel}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag
                icon={<User className="h-3.5 w-3.5" />}
                text={complaint.account_id}
              />

              <Tag
                icon={<FileText className="h-3.5 w-3.5" />}
                text={complaint.source_system}
              />

              <Tag
                icon={<Clock3 className="h-3.5 w-3.5" />}
                text={`Opened ${
                  complaint.date_opened ?? "—"
                }`}
              />
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              The Northwind complaint dataset contains structured
              operational fields rather than a free-text customer
              narrative. AI analysis therefore uses a separate
              synthetic/demo complaint text entered by the agent.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 lg:min-w-48">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              SLA
            </p>

            <p
              className={`mt-1 text-xl font-bold ${
                complaint.sla_breach
                  ? "text-red-700"
                  : "text-emerald-700"
              }`}
            >
              {complaint.sla_breach
                ? "Breached"
                : "Within SLA"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Target: {complaint.sla_days} days
            </p>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={ShieldAlert}
          title="SLA breach"
          value={
            complaint.sla_breach
              ? "Yes"
              : "No"
          }
          danger={Boolean(complaint.sla_breach)}
        />

        <Metric
          icon={Clock3}
          title="Days to close"
          value={
            complaint.days_to_close == null
              ? "Open"
              : `${complaint.days_to_close} d`
          }
        />

        <Metric
          icon={Zap}
          title="Transfers"
          value={String(
            complaint.transferred_between_systems,
          )}
          danger={
            complaint.transferred_between_systems > 2
          }
        />

        <Metric
          icon={FileText}
          title="Bill correction"
          value={
            complaint.bill_correction_value == null
              ? "—"
              : `$${complaint.bill_correction_value.toFixed(
                  2,
                )}`
          }
        />
      </div>

      {/* CONTEXT */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <Section
            title="Local operational context"
            description="Calculated locally from the Northwind datasets."
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info
              label="Region"
              value={
                context?.region ??
                complaint.region
              }
            />

            <Info
              label="Reporting month"
              value={
                context?.month ??
                complaint.date_opened?.slice(0, 7) ??
                "—"
              }
            />

            <Info
              label="Historical breach rate"
              value={percent(
                context?.historical_breach_rate,
              )}
            />

            <Info
              label="Estimated read rate"
              value={percent(
                context?.estimated_read_rate,
              )}
            />

            <Info
              label="Smart meter penetration"
              value={percent(
                context?.smart_meter_penetration,
              )}
            />

            <Info
              label="Transfer rate"
              value={percent(
                context?.transfer_rate,
              )}
            />

            <Info
              label="Reopen rate"
              value={percent(
                context?.reopen_rate,
              )}
            />

            <Info
              label="Average close time"
              value={
                context?.average_days_to_close == null
                  ? "—"
                  : `${context.average_days_to_close.toFixed(
                      1,
                    )} d`
              }
            />
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <Section
            title="Customer / operational history"
            description="Context assembled locally for the case."
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info
              label="Account"
              value={complaint.account_id}
            />

            <Info
              label="Previous complaints"
              value={value(
                history,
                "previous_complaints",
              )}
            />

            <Info
              label="Previous breaches"
              value={value(
                history,
                "previous_breaches",
              )}
            />

            <Info
              label="Previous transfers"
              value={value(
                history,
                "previous_transfers",
              )}
            />

            <Info
              label="Agent FTE"
              value={value(
                staffing,
                "agent_fte",
              )}
            />

            <Info
              label="Open vacancies"
              value={value(
                staffing,
                "open_vacancies",
              )}
            />

            <Info
              label="Monthly complaints opened"
              value={value(
                kpis,
                "complaints_opened",
              )}
            />

            <Info
              label="Regulator score"
              value={value(
                kpis,
                "regulator_satisfaction_score_of_5",
              )}
            />

            <Info
              label="Source system"
              value={
                complaint.source_system
              }
            />

            <Info
              label="Integration method"
              value={value(
                sourceSystem,
                "integration_method",
              )}
            />
          </div>
        </section>
      </div>

      {/* TIMELINE */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <Section
          title="Case timeline"
          description="Prototype operational workflow view."
        />

        <div className="mt-6">
          <CaseTimeline />
        </div>
      </section>

      {/* AI ASSISTANT */}
      <section className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
        <div className="border-b border-blue-100 bg-blue-50/50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Bot className="h-5 w-5 text-blue-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                AI triage assistant
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Enter synthetic/demo complaint text. The local
                Northwind CSV context is not sent to the LLM.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <MessageSquare className="h-4 w-4" />
              Agent input
            </div>

            <textarea
              value={complaintText}
              onChange={(event) =>
                setComplaintText(
                  event.target.value,
                )
              }
              placeholder="Example: My bill is much higher than usual and I believe the meter reading is incorrect..."
              className="mt-3 min-h-32 w-full resize-y rounded-lg border bg-white p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                Only this text is sent to the AI endpoint.
              </p>

              <button
                type="button"
                disabled={analyzing}
                onClick={() => void runAI()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />

                {analyzing
                  ? "Analyzing..."
                  : "Run AI analysis"}
              </button>
            </div>
          </div>

          {analysis && (
            <div className="mt-6 space-y-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Classification
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Info
                      label="Category"
                      value={analysis.category}
                    />

                    <Info
                      label="Priority"
                      value={analysis.priority}
                    />

                    <Info
                      label="Severity"
                      value={analysis.severity}
                    />

                    <Info
                      label="SLA risk"
                      value={`${Math.round(
                        analysis.sla_risk * 100,
                      )}%`}
                    />

                    <Info
                      label="Confidence"
                      value={`${Math.round(
                        analysis.confidence * 100,
                      )}%`}
                    />
                  </div>
                </div>

                <div className="rounded-xl border p-5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Recommended action
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-700">
                    {analysis.recommendation ??
                      "No recommendation returned."}
                  </p>

                  <div className="mt-5 rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Root cause
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {analysis.root_cause ??
                        "No root cause identified."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border bg-slate-900 p-5 text-white">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-300" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                      Suggested customer response
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-200">
                    {analysis.response ??
                      "No customer response returned."}
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Explanation
                  </p>

                  <div className="mt-4 space-y-3">
                    {analysis.explanation.length > 0 ? (
                      analysis.explanation.map(
                        (item, index) => (
                          <div
                            key={`${index}-${item}`}
                            className="flex gap-3"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                            <p className="text-sm leading-6 text-slate-600">
                              {item}
                            </p>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-sm text-slate-500">
                        No explanation returned.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


function Metric({
  icon: Icon,
  title,
  value: display,
  danger = false,
}: {
  icon: typeof Clock3
  title: string
  value: string
  danger?: boolean
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              danger
                ? "text-red-700"
                : "text-slate-900"
            }`}
          >
            {display}
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


function Section({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <h2 className="font-semibold text-slate-900">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}


function Info({
  label,
  value: display,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {display}
      </p>
    </div>
  )
}


function Tag({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      {icon}
      {text}
    </span>
  )
}


function PriorityBadge({
  priority,
}: {
  priority: string
}) {
  const styles: Record<string, string> = {
    P1: "bg-red-100 text-red-700",
    P2: "bg-orange-100 text-orange-700",
    P3: "bg-slate-100 text-slate-700",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[priority] ??
        "bg-slate-100 text-slate-700"
      }`}
    >
      {priority}
    </span>
  )
}


function StatusBadge({
  status,
}: {
  status: string
}) {
  const styles: Record<string, string> = {
    Open: "bg-blue-100 text-blue-700",
    Closed: "bg-emerald-100 text-emerald-700",
    "Closed - reopened":
      "bg-amber-100 text-amber-700",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ??
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  )
}


export default ComplaintDetails
