import type { ReactNode } from "react"

import Header from "./Header"
import Sidebar from "./Sidebar"

type DashboardLayoutProps = {
  children: ReactNode
}

function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout