import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Search,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  getComplaints,
} from "../../services/api"

import type {
  Complaint,
} from "../../types/api"


function Header() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Complaint[]>([])
  const [searchOpen, setSearchOpen] = useState(false)

  const [notificationsOpen, setNotificationsOpen] =
    useState(false)
  const [alerts, setAlerts] = useState<Complaint[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [loadingAlerts, setLoadingAlerts] = useState(false)

  useEffect(() => {
    const value = search.trim()

    if (!value) {
      setResults([])
      setLoadingSearch(false)
      return
    }

    const timer = window.setTimeout(async () => {
      setLoadingSearch(true)

      try {
        const response = await getComplaints({
          limit: 8,
          offset: 0,
          search: value,
        })

        setResults(response.items)
      } catch {
        setResults([])
      } finally {
        setLoadingSearch(false)
      }
    }, 250)

    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!notificationsOpen) {
      return
    }

    async function loadAlerts() {
      setLoadingAlerts(true)

      try {
        const response = await getComplaints({
          limit: 100,
          offset: 0,
        })

        setAlerts(
          response.items.filter(
            (complaint) =>
              complaint.sla_breach === 1 ||
              String(complaint.status).toLowerCase() !== "closed",
          ).slice(0, 8),
        )
      } catch {
        setAlerts([])
      } finally {
        setLoadingAlerts(false)
      }
    }

    void loadAlerts()
  }, [notificationsOpen])

  function openComplaint(complaintId: string) {
    setSearch("")
    setSearchOpen(false)
    navigate(`/complaints/${complaintId}`)
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-white/95 px-6 backdrop-blur">
      <div className="hidden lg:block">
        <p className="text-sm font-medium text-slate-700">
          Complaint Operations
        </p>

        <p className="text-xs text-slate-400">
          Agent workspace
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block">
          <div className="flex w-72 items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-200">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search complaints..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {searchOpen && search.trim() && (
            <div className="absolute right-0 top-12 z-50 w-[420px] overflow-hidden rounded-xl border bg-white shadow-xl">
              <div className="border-b px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Complaint search
                </p>
              </div>

              {loadingSearch ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y">
                  {results.map((complaint) => (
                    <button
                      key={complaint.complaint_id}
                      type="button"
                      onClick={() =>
                        openComplaint(complaint.complaint_id)
                      }
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Search className="h-4 w-4 text-slate-600" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {complaint.complaint_id}
                          </p>

                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {complaint.priority}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {complaint.account_id} · {complaint.region}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {complaint.category} · {complaint.status}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-900">
                    No complaints found
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Try a complaint ID, account, region or category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setNotificationsOpen((current) => !current)
            }
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Operational alerts"
          >
            <Bell className="h-5 w-5" />

            {alerts.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                {alerts.length > 9 ? "9+" : alerts.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Operational alerts
                  </p>

                  <p className="text-xs text-slate-500">
                    Recent cases requiring attention
                  </p>
                </div>

                <Bell className="h-4 w-4 text-slate-400" />
              </div>

              {loadingAlerts ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Loading alerts...
                </div>
              ) : alerts.length > 0 ? (
                <div className="max-h-96 divide-y overflow-y-auto">
                  {alerts.map((complaint) => {
                    const breach = complaint.sla_breach === 1

                    return (
                      <button
                        key={complaint.complaint_id}
                        type="button"
                        onClick={() =>
                          openComplaint(complaint.complaint_id)
                        }
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            breach
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {breach ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Info className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {complaint.complaint_id}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {breach
                              ? "SLA breach recorded"
                              : "Case remains open"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {complaint.category}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    No immediate alerts
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    The current queue has no surfaced alerts.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            AG
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-900">
              Agent
            </p>

            <p className="text-[11px] text-slate-500">
              Customer Operations
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
