import {
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  User,
} from "lucide-react"

type TimelineItem = {
  id: number
  title: string
  description: string
  time: string
  icon: "user" | "file" | "message" | "clock" | "check"
}

const timeline: TimelineItem[] = [
  {
    id: 1,
    title: "Complaint received",
    description:
      "Customer complaint was received and added to the complaint queue.",
    time: "42 days ago",
    icon: "user",
  },
  {
    id: 2,
    title: "Initial review",
    description:
      "Case was reviewed by customer operations and classified as a billing issue.",
    time: "39 days ago",
    icon: "file",
  },
  {
    id: 3,
    title: "Transferred",
    description:
      "Case was transferred to another operational team for additional investigation.",
    time: "31 days ago",
    icon: "message",
  },
  {
    id: 4,
    title: "Additional review required",
    description:
      "The complaint remains unresolved and requires billing and meter evidence review.",
    time: "12 days ago",
    icon: "clock",
  },
  {
    id: 5,
    title: "AI triage recommendation",
    description:
      "Prototype triage recommends prioritizing the case because of elevated SLA exposure.",
    time: "Today",
    icon: "check",
  },
]

function CaseTimeline() {
  return (
    <div className="relative">

      {/* Vertical line */}
      <div className="absolute bottom-5 left-5 top-5 hidden w-px bg-slate-200 sm:block" />

      <div className="space-y-6">
        {timeline.map((item, index) => (
          <TimelineRow
            key={item.id}
            item={item}
            isLast={index === timeline.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineRow({
  item,
  isLast,
}: {
  item: TimelineItem
  isLast: boolean
}) {
  return (
    <div className="relative flex gap-4">

      {/* Icon */}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm">
        <TimelineIcon type={item.icon} />
      </div>

      {/* Content */}
      <div
        className={`min-w-0 flex-1 ${
          !isLast ? "pb-1" : ""
        }`}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-900">
            {item.title}
          </p>

          <span className="text-xs text-slate-400">
            {item.time}
          </span>
        </div>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          {item.description}
        </p>
      </div>
    </div>
  )
}

function TimelineIcon({
  type,
}: {
  type: TimelineItem["icon"]
}) {
  if (type === "user") {
    return (
      <User className="h-4 w-4 text-slate-500" />
    )
  }

  if (type === "file") {
    return (
      <FileText className="h-4 w-4 text-slate-500" />
    )
  }

  if (type === "message") {
    return (
      <MessageSquare className="h-4 w-4 text-slate-500" />
    )
  }

  if (type === "clock") {
    return (
      <Clock3 className="h-4 w-4 text-amber-600" />
    )
  }

  return (
    <CheckCircle2 className="h-4 w-4 text-blue-600" />
  )
}

export default CaseTimeline