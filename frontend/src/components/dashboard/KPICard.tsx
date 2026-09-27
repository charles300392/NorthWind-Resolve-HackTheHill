import type { LucideIcon } from "lucide-react"

type KPICardProps = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  variant?: "default" | "warning" | "danger" | "success"
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
  const styles = {
    default: {
      icon: "bg-slate-100 text-slate-700",
      value: "text-slate-900",
    },
    warning: {
      icon: "bg-amber-100 text-amber-700",
      value: "text-amber-700",
    },
    danger: {
      icon: "bg-red-100 text-red-700",
      value: "text-red-700",
    },
    success: {
      icon: "bg-emerald-100 text-emerald-700",
      value: "text-emerald-700",
    },
  }

  const current = styles[variant]

  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={[
        "w-full rounded-xl border bg-white p-5 text-left shadow-sm transition",
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
          : "cursor-default",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${current.value}`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${current.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  )
}

export default KPICard
