import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Clock3,
  FileText,
  Send,
  ShieldAlert,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import CaseTimeline
  from "../components/case/CaseTimeline"

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
) {

  const v =
    record?.[key]


  return v === undefined ||
    v === null ||
    v === ""
    ? fallback
    : String(v)
}


function ComplaintDetails() {

  const {
    id,
  } =
    useParams()


  const navigate =
    useNavigate()


  const [
    complaint,
    setComplaint,
  ] =
    useState<Complaint | null>(
      null,
    )


  const [
    context,
    setContext,
  ] =
    useState<ComplaintContext | null>(
      null,
    )


  const [
    analysis,
    setAnalysis,
  ] =
    useState<AIAnalysis | null>(
      null,
    )


  const [
    complaintText,
    setComplaintText,
  ] =
    useState("")


  const [
    loading,
    setLoading,
  ] =
    useState(true)


  const [
    analyzing,
    setAnalyzing,
  ] =
    useState(false)


  const [
    error,
    setError,
  ] =
    useState("")


  useEffect(() => {

    if (!id) {
      return
    }


    setLoading(true)
    setError("")


    Promise.all([
      getComplaint(id),
      getComplaintContext(id),
    ])

      .then(
        ([
          caseData,
          caseContext,
        ]) => {

          setComplaint(
            caseData,
          )

          setContext(
            caseContext,
          )

        },
      )

      .catch(
        (err: unknown) => {

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load complaint",
          )

        },
      )

      .finally(() => {

        setLoading(false)

      })

  }, [id])


  async function runAI() {

    if (
      !complaintText.trim()
    ) {

      setError(
        "Enter a synthetic/demo complaint before running AI analysis.",
      )

      return
    }


    setAnalyzing(true)
    setError("")


    try {

      /*
       * IMPORTANT:
       *
       * Only the user-entered complaint text
       * is sent to Gemini.
       *
       * Northwind CSV context is NOT sent.
       */

      const result =
        await analyzeComplaint({
          complaint_text:
            complaintText.trim(),
        })


      setAnalysis(
        result,
      )

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

      <div className="p-10 text-center text-sm text-slate-500">
        Loading complaint...
      </div>

    )
  }


  if (!complaint) {

    return (

      <div className="space-y-4">

        <button
          onClick={() =>
            navigate(
              "/complaints",
            )
          }
          className="inline-flex items-center gap-2 text-sm text-slate-600"
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

      <button
        type="button"
        onClick={() =>
          navigate(
            "/complaints",
          )
        }
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


      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-2xl font-bold text-slate-900">
                {complaint.complaint_id}
              </h1>


              <Badge
                value={
                  complaint.priority
                }
              />


              <Badge
                value={
                  complaint.status
                }
              />

            </div>


            <p className="mt-2 text-sm text-slate-500">
              {complaint.category}
              {" · "}
              {complaint.region}
              {" · "}
              {complaint.channel}
            </p>


            <p className="mt-3 text-sm text-slate-700">
              This case is displayed from the local Northwind structured dataset.
              The CSV does not contain a free-text complaint narrative.
            </p>

          </div>


          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">

            <span className="text-slate-500">
              Opened
            </span>

            <div className="font-semibold text-slate-900">
              {complaint.date_opened ?? "—"}
            </div>

          </div>

        </div>

      </div>


      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Metric
          icon={ShieldAlert}
          title="SLA breach"
          value={
            complaint.sla_breach
              ? "Yes"
              : "No"
          }
          danger={
            Boolean(
              complaint.sla_breach,
            )
          }
        />


        <Metric
          icon={Clock3}
          title="Days to close"
          value={
            complaint.days_to_close ===
            null
              ? "Open"
              : `${complaint.days_to_close} d`
          }
        />


        <Metric
          icon={AlertTriangle}
          title="Transfers"
          value={String(
            complaint.transferred_between_systems,
          )}
          danger={
            complaint.transferred_between_systems >
            2
          }
        />


        <Metric
          icon={FileText}
          title="Bill correction"
          value={
            complaint.bill_correction_value ==
            null
              ? "—"
              : `$${complaint.bill_correction_value.toFixed(
                  2,
                )}`
          }
        />

      </div>


      <div className="grid gap-6 xl:grid-cols-2">

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <Section title="Local case context" />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            <Info
              label="Region"
              value={
                context?.region ??
                complaint.region
              }
            />

            <Info
              label="Month"
              value={
                context?.month ??
                complaint.date_opened?.slice(
                  0,
                  7,
                ) ??
                "—"
              }
            />

            <Info
              label="Historical breach rate"
              value={
                context?.historical_breach_rate ==
                null
                  ? "—"
                  : `${(
                      context.historical_breach_rate *
                      100
                    ).toFixed(1)}%`
              }
            />

            <Info
              label="Estimated read rate"
              value={
                context?.estimated_read_rate ==
                null
                  ? "—"
                  : `${(
                      context.estimated_read_rate *
                      100
                    ).toFixed(1)}%`
              }
            />

            <Info
              label="Smart meter penetration"
              value={
                context?.smart_meter_penetration ==
                null
                  ? "—"
                  : `${(
                      context.smart_meter_penetration *
                      100
                    ).toFixed(1)}%`
              }
            />

            <Info
              label="Transfer rate"
              value={
                context?.transfer_rate ==
                null
                  ? "—"
                  : `${(
                      context.transfer_rate *
                      100
                    ).toFixed(1)}%`
              }
            />

            <Info
              label="Reopen rate"
              value={
                context?.reopen_rate ==
                null
                  ? "—"
                  : `${(
                      context.reopen_rate *
                      100
                    ).toFixed(1)}%`
              }
            />

            <Info
              label="Average close time"
              value={
                context?.average_days_to_close ==
                null
                  ? "—"
                  : `${context.average_days_to_close.toFixed(
                      1,
                    )} d`
              }
            />

          </div>

        </section>


        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <Section title="Customer / operational history" />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            <Info
              label="Account"
              value={
                complaint.account_id
              }
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

          </div>

        </section>

      </div>


      <section className="rounded-xl border border-blue-200 bg-white shadow-sm">

        <div className="border-b border-blue-100 bg-blue-50/50 p-6">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">

              <Bot className="h-5 w-5 text-blue-700" />

            </div>


            <div>

              <h2 className="font-semibold text-slate-900">
                AI triage
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Analyze synthetic/demo complaint text.
                Northwind CSV context is not sent to the LLM.
              </p>

            </div>

          </div>

        </div>


        <div className="p-6">

          <textarea
            value={complaintText}
            onChange={(event) =>
              setComplaintText(
                event.target.value,
              )
            }
            placeholder="Example: My electricity bill is much higher than usual and I believe the meter reading is incorrect..."
            className="min-h-32 w-full rounded-xl border bg-slate-50 p-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
          />


          <div className="mt-3 flex justify-end">

            <button
              type="button"
              disabled={analyzing}
              onClick={() =>
                void runAI()
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >

              <Bot className="h-4 w-4" />

              {
                analyzing
                  ? "Analyzing..."
                  : "Run AI analysis"
              }

            </button>

          </div>


          {analysis && (

            <div className="mt-6 grid gap-5 lg:grid-cols-2">

              <div className="rounded-xl border bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Classification
                </p>


                <div className="mt-3 space-y-3">

                  <Info
                    label="Category"
                    value={
                      analysis.category
                    }
                  />

                  <Info
                    label="Priority"
                    value={
                      analysis.priority
                    }
                  />

                  <Info
                    label="Severity"
                    value={
                      analysis.severity
                    }
                  />

                  <Info
                    label="SLA risk"
                    value={`${Math.round(
                      analysis.sla_risk *
                        100,
                    )}%`}
                  />

                  <Info
                    label="Confidence"
                    value={`${Math.round(
                      analysis.confidence *
                        100,
                    )}%`}
                  />

                </div>

              </div>


              <div className="space-y-4">

                <Info
                  label="Root cause"
                  value={
                    analysis.root_cause ??
                    "Not identified"
                  }
                />

                <Info
                  label="Recommendation"
                  value={
                    analysis.recommendation ??
                    "No recommendation"
                  }
                />


                <div className="rounded-xl border p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Explanation
                  </p>


                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">

                    {analysis.explanation.map(
                      (
                        item,
                        index,
                      ) => (

                        <li
                          key={index}
                        >
                          {item}
                        </li>

                      ),
                    )}

                  </ul>

                </div>

              </div>


              <div className="lg:col-span-2 rounded-xl border bg-white p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Generated response
                </p>


                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {
                    analysis.response ??
                    "No response generated."
                  }
                </p>


                <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">

                  <Send className="h-4 w-4" />

                  Human approval required before sending.

                </div>

              </div>

            </div>

          )}

        </div>

      </section>


      {sourceSystem && (

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <Section title="Source system context" />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <Info
              label="System"
              value={value(
                sourceSystem,
                "system_name",
              )}
            />

            <Info
              label="Vendor"
              value={value(
                sourceSystem,
                "vendor",
              )}
            />

            <Info
              label="Tech stack"
              value={value(
                sourceSystem,
                "tech_stack",
              )}
            />

            <Info
              label="Integration"
              value={value(
                sourceSystem,
                "integration_method",
              )}
            />

            <Info
              label="Owning function"
              value={value(
                sourceSystem,
                "owning_function",
              )}
            />

            <Info
              label="Annual run cost"
              value={
                sourceSystem.annual_run_cost ==
                null
                  ? "—"
                  : `$${Number(
                      sourceSystem.annual_run_cost,
                    ).toLocaleString()}`
              }
            />

          </div>

        </section>

      )}


      <section className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-2">

          <Clock3 className="h-5 w-5 text-slate-600" />

          <h2 className="font-semibold text-slate-900">
            Case history
          </h2>

        </div>


        <div className="mt-6">

          <CaseTimeline />

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
}: {
  title: string
}) {

  return (

    <h2 className="font-semibold text-slate-900">
      {title}
    </h2>

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


function Badge({
  value: display,
}: {
  value: string
}) {

  return (

    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {display}
    </span>

  )
}


export default ComplaintDetails