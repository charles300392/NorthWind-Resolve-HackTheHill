import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Send,
  ShieldAlert,
  User,
  Zap,
} from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { complaints, customers } from "../data/mockData"

function ComplaintDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const complaint = complaints.find(
    (item) => item.id === id,
  )

  if (!complaint) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Complaint not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The selected complaint could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/complaints")}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Back to complaints
          </button>
        </div>
      </div>
    )
  }

  return (
    <ComplaintContent
      complaint={complaint}
      navigateBack={() => navigate("/complaints")}
      customers={customers}
    />
  )
}

type ComplaintContentProps = {
  complaint: (typeof complaints)[number]
  navigateBack: () => void
  customers: typeof customers
}

function ComplaintContent({
  complaint,
  navigateBack,
  customers,
}: ComplaintContentProps) {
  const customer = customers.find(
    (item) => item.id === complaint.customerId,
  )

  const [isTriaging, setIsTriaging] = useState(false)
  const [triageComplete, setTriageComplete] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [responseGenerated, setResponseGenerated] =
    useState(false)

  const [actionMessage, setActionMessage] = useState("")

  const [response, setResponse] = useState(
    `Hello ${complaint.customerName},

Thank you for contacting Northwind Utilities regarding your ${complaint.category.toLowerCase()} concern.

We have reviewed your complaint and identified that the case requires further investigation.

Our team will review the relevant account and service information and follow up with you as soon as possible.

We apologize for the inconvenience and appreciate your patience.

Kind regards,

Northwind Utilities Customer Operations`,
  )

  const slaPercentage = Math.round(
    complaint.slaRisk * 100,
  )

  const triagePriority =
    complaint.slaRisk >= 0.9
      ? "Critical"
      : complaint.slaRisk >= 0.75
        ? "High"
        : "Medium"

  const recommendedAction =
    complaint.slaRisk >= 0.9
      ? "Immediate escalation and specialist review"
      : complaint.slaRisk >= 0.75
        ? "Prioritize investigation and customer response"
        : "Standard investigation workflow"

  function showAction(message: string) {
    setActionMessage(message)

    window.setTimeout(() => {
      setActionMessage("")
    }, 3000)
  }

  function runTriage() {
    setIsTriaging(true)
    setTriageComplete(false)

    window.setTimeout(() => {
      setIsTriaging(false)
      setTriageComplete(true)
    }, 1000)
  }

  function generateResponse() {
    setIsGenerating(true)
    setResponseGenerated(false)

    window.setTimeout(() => {
      setIsGenerating(false)
      setResponseGenerated(true)

      setResponse(
        `Hello ${complaint.customerName},

Thank you for contacting Northwind Utilities regarding your ${complaint.category.toLowerCase()} complaint.

Our initial review indicates that your case requires additional investigation.

We have prioritized the case for review and will assess the relevant account and service information.

We understand the importance of resolving this issue and will provide you with an update as soon as possible.

We apologize for the inconvenience.

Kind regards,

Northwind Utilities Customer Operations`,
      )
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* BACK */}
      <button
        type="button"
        onClick={navigateBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to complaints
      </button>

      {/* HEADER */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {complaint.id}
              </h1>

              <PriorityBadge
                priority={complaint.priority}
              />

              <StatusBadge
                status={complaint.status}
              />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {complaint.customerName} ·{" "}
              {complaint.category} · {complaint.service}
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-700">
              {complaint.description}
            </p>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-red-500">
              SLA Risk
            </p>

            <p className="mt-1 text-3xl font-bold text-red-600">
              {slaPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* AI TRIAGE */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
              <Bot className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                AI Complaint Triage
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-300">
                Analyze the complaint and recommend the next
                operational action.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={runTriage}
            disabled={isTriaging}
            className="flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-60"
          >
            <Zap className="h-4 w-4" />

            {isTriaging
              ? "Analyzing..."
              : "Run AI triage"}
          </button>
        </div>

        {triageComplete && (
          <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 md:grid-cols-3">
            <TriageBox
              title="Recommended priority"
              value={triagePriority}
            />

            <TriageBox
              title="SLA exposure"
              value={`${slaPercentage}%`}
            />

            <TriageBox
              title="Recommended action"
              value={recommendedAction}
            />
          </div>
        )}
      </div>

      {/* INFORMATION */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CUSTOMER */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-500" />

            <h2 className="font-semibold text-slate-900">
              Customer information
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InfoItem
              label="Customer"
              value={complaint.customerName}
            />

            <InfoItem
              label="Customer ID"
              value={complaint.customerId}
            />

            <InfoItem
              label="Service"
              value={complaint.service}
            />

            <InfoItem
              label="Account status"
              value={
                customer?.accountStatus ?? "Active"
              }
            />

            <InfoItem
              label="Category"
              value={complaint.category}
            />

            <InfoItem
              label="Priority"
              value={complaint.priority}
            />
          </div>
        </div>

        {/* SLA */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />

              <h2 className="font-semibold text-slate-900">
                SLA exposure
              </h2>
            </div>

            <span className="text-2xl font-bold text-red-600">
              {slaPercentage}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-500"
              style={{
                width: `${slaPercentage}%`,
              }}
            />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-lg bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <p className="text-sm leading-5 text-amber-800">
              This complaint should remain visible in the
              priority queue until the underlying issue has
              been investigated.
            </p>
          </div>
        </div>
      </div>

      {/* CASE HISTORY */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-slate-500" />

          <h2 className="font-semibold text-slate-900">
            Case history
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          <HistoryItem
            title="Complaint received"
            description="Complaint entered into the Northwind operations queue."
          />

          <HistoryItem
            title="Initial review"
            description="Case reviewed by customer operations."
          />

          <HistoryItem
            title="Priority assessment"
            description="SLA exposure identified for operational triage."
          />

          <HistoryItem
            title="AI triage"
            description="AI recommendation available for agent review."
          />
        </div>
      </div>

      {/* RESPONSE ASSISTANT */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-slate-500" />

                <h2 className="font-semibold text-slate-900">
                  Response Assistant
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Generate a customer-ready response using the
                complaint context.
              </p>
            </div>

            <button
              type="button"
              onClick={generateResponse}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <Bot className="h-4 w-4" />

              {isGenerating
                ? "Generating..."
                : responseGenerated
                  ? "Regenerate"
                  : "Generate response"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <textarea
            value={response}
            onChange={(event) =>
              setResponse(event.target.value)
            }
            className="min-h-64 w-full resize-y rounded-lg border bg-slate-50 p-4 text-sm leading-6 text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-slate-200"
          />

          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                showAction(
                  "Response draft saved successfully.",
                )
              }
              className="rounded-lg border px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Save draft
            </button>

            <button
              type="button"
              onClick={() =>
                showAction(
                  "Response approved and queued for sending.",
                )
              }
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Send className="h-4 w-4" />
              Approve & queue
            </button>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Case actions
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Take the next operational action.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              showAction(
                "Complaint escalated successfully.",
              )
            }
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Escalate
          </button>

          <button
            type="button"
            onClick={() =>
              showAction(
                "Complaint marked as resolved.",
              )
            }
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Resolve
          </button>
        </div>
      </div>

      {/* NOTIFICATION */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border bg-white px-5 py-4 shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="text-sm font-medium text-slate-900">
            {actionMessage}
          </p>
        </div>
      )}
    </div>
  )
}

function TriageBox({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  )
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium text-slate-900">
        {value}
      </p>
    </div>
  )
}

function HistoryItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="relative flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-slate-900" />
        <div className="mt-1 h-full w-px bg-slate-200" />
      </div>

      <div className="pb-5">
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm leading-5 text-slate-500">
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
  const style =
    priority === "Critical"
      ? "border-red-200 bg-red-100 text-red-700"
      : priority === "High"
        ? "border-orange-200 bg-orange-100 text-orange-700"
        : priority === "Medium"
          ? "border-amber-200 bg-amber-100 text-amber-700"
          : "border-slate-200 bg-slate-100 text-slate-600"

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
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
  const style =
    status === "Resolved"
      ? "border-emerald-200 bg-emerald-100 text-emerald-700"
      : status === "Pending"
        ? "border-amber-200 bg-amber-100 text-amber-700"
        : status === "In Progress"
          ? "border-violet-200 bg-violet-100 text-violet-700"
          : "border-blue-200 bg-blue-100 text-blue-700"

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  )
}

export default ComplaintDetails