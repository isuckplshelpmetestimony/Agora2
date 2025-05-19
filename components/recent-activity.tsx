import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, FileText, MessageSquare, Zap } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Jane Doe",
        avatar: "/placeholder-user.jpg",
        initials: "JD",
      },
      action: "completed",
      target: "Homepage redesign",
      time: "2 hours ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
    },
    {
      id: 2,
      user: {
        name: "John Smith",
        avatar: "/placeholder-user.jpg",
        initials: "JS",
      },
      action: "commented on",
      target: "User authentication flow",
      time: "4 hours ago",
      icon: MessageSquare,
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      user: {
        name: "Emily Chen",
        avatar: "/placeholder-user.jpg",
        initials: "EC",
      },
      action: "created",
      target: "User research report",
      time: "Yesterday",
      icon: FileText,
      iconColor: "text-violet-500",
    },
    {
      id: 4,
      user: {
        name: "Michael Brown",
        avatar: "/placeholder-user.jpg",
        initials: "MB",
      },
      action: "started",
      target: "Sprint planning",
      time: "Yesterday",
      icon: Zap,
      iconColor: "text-amber-500",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
        </div>
      ))}
    </div>
  )
}
