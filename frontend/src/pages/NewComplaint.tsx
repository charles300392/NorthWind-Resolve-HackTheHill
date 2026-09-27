import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Send,
} from "lucide-react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { createComplaint } from "../services/api"
import type { NewComplaintResponse } from "../types/api"

const REGIONS = [
  "Ashford",
  "Barrowdale",
  "Calderfield",
  "Dunmoor",
  "Eastmarch",
  "Fenwick",
]

const CHANNELS = [
  "Web form",
  "Email",
  "Phone",
  "Post",
  "Social",
  "Regulator referral",
]

function NewComplaint() {
  const navigate = useNavigate()
  const [complaintText, setComplaintText] = useState("")
  const [accountId, setAccountId] = useState("")
  const [region, setRegion] = useState("Ashford")
  const [channel, setChannel] = useState("Web form")
  const [result, setResult] = useState<NewComplaintResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit() {
    if (complaintText.trim().length < 10) {
      setError("Please enter at least 10 characters describing the complaint.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await createComplaint({
        complaint_text: complaintText.trim(),
        account_id: accountId.trim() || undefined,
        region,
        channel,
      })

      setResult(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create complaint",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/complaints")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to complaints
      </button>

      <div>
        <p className="text-sm font-medium text-slate-500">
          Complaint intake
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          New complaint
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          Submit a new complaint. Northwind Resolve will automatically triage it,
          calculate local operational risk, place it in a resolution queue, and
          draft a customer response.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Account ID <span className="text-slate-400">(optional)</span>
            </span>
            <input
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              placeholder="ACC-123456"
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Region</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            >
              {REGIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Channel</span>
            <select
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            >
              {CHANNELS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Customer complaint
            </span>
            <textarea
              value={complaintText}
              onChange={(event) => setComplaintText(event.target.value)}
              placeholder="Example: My electricity bill is much higher than usual and I believe the meter reading is incorrect. I have checked the meter and the reading does not match the bill."
              className="mt-2 min-h-44 w-full rounded-xl border bg-slate-50 p-4 text-sm leading-6 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-2 text-xs text-slate-400">
              This complaint text is the only customer content sent to the AI model.
            </p>
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() => void submit()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Bot className="h-4 w-4" />
            {loading ? "Triaging complaint..." : "Create & triage complaint"}
          </button>
        </div>
      </section>

      {result && (
        <section className="rounded-xl border border-blue-200 bg-white shadow-sm">
          <div className="border-b border-blue-100 bg-blue-50/50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Complaint {result.complaint_id} created and triaged
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  The case is now in the {result.queue.toLowerCase()} queue.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
            <ResultMetric label="Category" value={result.category} />
            <ResultMetric label="Priority" value={result.priority} />
            <ResultMetric label="Severity" value={result.severity} />
            <ResultMetric label="Triage score" value={`${Math.round(result.triage_score * 100)}%`} />
            <ResultMetric label="SLA risk" value={`${Math.round(result.sla_risk * 100)}%`} />
          </div>

          <div className="grid gap-5 border-t p-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Why this was triaged this way
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Queue: {result.queue}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                {result.explanation.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                AI confidence: {Math.round(result.confidence * 100)}%
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Recommended action
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {result.recommendation ?? "No recommendation generated."}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Draft customer response
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {result.response ?? "No response generated."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                  <Send className="h-4 w-4" />
                  Human approval required before sending.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t p-6">
            <button
              type="button"
              onClick={() => navigate(`/complaints/${result.complaint_id}`)}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Open triaged complaint
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null)
                setComplaintText("")
              }}
              className="rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              Add another complaint
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function ResultMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export default NewComplaint
