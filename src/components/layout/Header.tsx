import {
  AlertTriangle,
  Bell,
  Info,
  Search,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  complaints,
  notifications,
} from "../../data/mockData"

function Header() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [isSearchFocused, setIsSearchFocused] =
    useState(false)

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false)

  const [readNotifications, setReadNotifications] =
    useState<string[]>([])

  const searchResults = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return []
    }

    return complaints
      .filter(
        (complaint) =>
          complaint.id.toLowerCase().includes(value) ||
          complaint.customerName
            .toLowerCase()
            .includes(value) ||
          complaint.category
            .toLowerCase()
            .includes(value),
      )
      .slice(0, 5)
  }, [search])

  const unreadCount = notifications.filter(
    (notification) =>
      notification.unread &&
      !readNotifications.includes(notification.id),
  ).length

  function handleResultClick(id: string) {
    setSearch("")
    setIsSearchFocused(false)

    navigate(`/complaints/${id}`)
  }

  function handleNotificationClick(
    notificationId: string,
    complaintId?: string,
  ) {
    setReadNotifications((current) =>
      current.includes(notificationId)
        ? current
        : [...current, notificationId],
    )

    setIsNotificationsOpen(false)

    if (complaintId) {
      navigate(`/complaints/${complaintId}`)
    }
  }

  function markAllAsRead() {
    setReadNotifications(
      notifications
        .filter((notification) => notification.unread)
        .map((notification) => notification.id),
    )
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <p className="text-sm text-slate-500">
          Complaint Operations
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-200">
            <Search className="h-4 w-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSearchFocused(false)
                }, 150)
              }}
              placeholder="Search complaints..."
              className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {isSearchFocused &&
            search.trim().length > 0 && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border bg-white shadow-xl">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="border-b px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Search results
                      </p>
                    </div>

                    <div className="divide-y">
                      {searchResults.map((complaint) => (
                        <button
                          key={complaint.id}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault()
                          }}
                          onClick={() =>
                            handleResultClick(
                              complaint.id,
                            )
                          }
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <Search className="h-4 w-4 text-slate-600" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">
                              {complaint.id}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {complaint.customerName}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {complaint.category} ·{" "}
                              {complaint.status}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-medium text-slate-900">
                      No results found
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Try a complaint ID, customer name,
                      or category.
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
              setIsNotificationsOpen(
                (current) => !current,
              )
            }
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Notifications
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {unreadCount} unread
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const isUnread =
                    notification.unread &&
                    !readNotifications.includes(
                      notification.id,
                    )

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.complaintId,
                        )
                      }
                      className={`flex w-full gap-3 border-b px-4 py-4 text-left transition hover:bg-slate-50 ${
                        isUnread
                          ? "bg-blue-50/40"
                          : "bg-white"
                      }`}
                    >
                      <NotificationIcon
                        type={notification.type}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-slate-900">
                            {notification.title}
                          </p>

                          {isUnread && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {notification.description}
                        </p>

                        <p className="mt-2 text-[11px] text-slate-400">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            AG
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              Agent
            </p>

            <p className="text-xs text-slate-500">
              Customer Operations
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

function NotificationIcon({
  type,
}: {
  type: "danger" | "warning" | "info"
}) {
  if (type === "danger") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
        <AlertTriangle className="h-4 w-4 text-red-600" />
      </div>
    )
  }

  if (type === "warning") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      </div>
    )
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
      <Info className="h-4 w-4 text-blue-600" />
      </div>
  )
}

export default Header