import type { LucideIcon } from "lucide-react"

type KPICardProps = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  variant?: "default" | "warning" | "danger"
  onClick?: () => void
}

function KPICard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  onClick,
}: KPICardProps) {
  const iconStyles = {
    default: "bg-slate-100 text-slate-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full rounded-xl border bg-white p-5 text-left shadow-sm ${
        onClick
          ? "cursor-pointer transition-shadow hover:shadow-md"
          : "cursor-default"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconStyles[variant]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  )
}

export default KPICard