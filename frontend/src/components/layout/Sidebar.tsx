import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  WalletCards,
} from "lucide-react"

import {
  NavLink,
} from "react-router-dom"


const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Complaints",
    path: "/complaints",
    icon: ClipboardList,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Value Case",
    path: "/value-case",
    icon: WalletCards,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
]


function Sidebar() {
  return (
    <aside className="flex w-[230px] shrink-0 flex-col border-r bg-white">
      <div className="border-b px-5 py-4">
        <p className="text-lg font-bold text-slate-900">
          Northwind
        </p>

        <p className="text-xs text-slate-500">
          Utilities
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map(
          ({
            name,
            path,
            icon: Icon,
          }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />

              <span>{name}</span>
            </NavLink>
          ),
        )}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-700">
            Agent Workspace
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Complaint Operations
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
