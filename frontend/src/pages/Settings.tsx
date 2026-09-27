import {
  Bell,
  CheckCircle2,
  Monitor,
  Save,
  SlidersHorizontal,
  User,
} from "lucide-react"
import { useState } from "react"

function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true)

  const [slaAlertsEnabled, setSlaAlertsEnabled] =
    useState(true)

  const [emailEnabled, setEmailEnabled] =
    useState(false)

  const [autoRecommendations, setAutoRecommendations] =
    useState(true)

  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your agent workspace preferences.
        </p>
      </div>

      {/* SAVE MESSAGE */}

      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />

          <div>
            <p className="text-sm font-semibold text-green-900">
              Settings saved
            </p>

            <p className="text-xs text-green-700">
              Your workspace preferences have been updated.
            </p>
          </div>
        </div>
      )}

      {/* PROFILE */}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <SectionHeader
          icon={User}
          title="Agent profile"
          description="Information associated with your workspace."
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Name"
            value="Agent"
          />

          <Field
            label="Role"
            value="Customer Operations"
          />

          <Field
            label="Workspace"
            value="Complaint Operations"
          />

          <Field
            label="Access level"
            value="Agent"
          />
        </div>
      </section>

      {/* NOTIFICATIONS */}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Choose which operational alerts you receive."
        />

        <div className="mt-6 divide-y">
          <ToggleRow
            title="Enable notifications"
            description="Receive important complaint and workflow alerts."
            enabled={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />

          <ToggleRow
            title="SLA risk alerts"
            description="Receive alerts when complaints approach their SLA threshold."
            enabled={slaAlertsEnabled}
            onChange={setSlaAlertsEnabled}
          />

          <ToggleRow
            title="Email notifications"
            description="Receive selected operational notifications by email."
            enabled={emailEnabled}
            onChange={setEmailEnabled}
          />
        </div>
      </section>

      {/* TRIAGE */}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <SectionHeader
          icon={SlidersHorizontal}
          title="Complaint triage"
          description="Configure how recommendations appear in the workspace."
        />

        <div className="mt-6 divide-y">
          <ToggleRow
            title="AI recommendations"
            description="Show suggested next actions on complaint details."
            enabled={autoRecommendations}
            onChange={setAutoRecommendations}
          />

          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Default priority view
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose which complaints appear first in the agent queue.
              </p>
            </div>

            <select
              defaultValue="SLA risk"
              className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option>SLA risk</option>
              <option>Priority</option>
              <option>Case age</option>
              <option>Transfers</option>
            </select>
          </div>
        </div>
      </section>

      {/* APPEARANCE */}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <SectionHeader
          icon={Monitor}
          title="Appearance"
          description="Manage the appearance of the workspace."
        />

        <div className="mt-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Theme
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Select the visual theme used by the workspace.
              </p>
            </div>

            <select
              defaultValue="Light"
              className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>
      </section>

      {/* ACTIONS */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          <Save className="h-4 w-4" />
          Save settings
        </button>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof User
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-700" />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900">
          {title}
        </h2>

        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </label>

      <input
        type="text"
        defaultValue={value}
        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-slate-200"
      />
    </div>
  )
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-5">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-slate-900"
            : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  )
}

export default Settings