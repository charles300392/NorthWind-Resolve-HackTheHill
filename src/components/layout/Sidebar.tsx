import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"
import { NavLink } from "react-router-dom"

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
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
]

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Northwind
          </h1>

          <p className="text-xs text-slate-500">
            Utilities
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm font-medium text-slate-900">
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