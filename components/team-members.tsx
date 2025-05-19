import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TeamMembers() {
  const team = [
    {
      name: "Jane Doe",
      role: "Product Designer",
      avatar: "/placeholder-user.jpg",
      initials: "JD",
      status: "online",
    },
    {
      name: "John Smith",
      role: "Frontend Developer",
      avatar: "/placeholder-user.jpg",
      initials: "JS",
      status: "online",
    },
    {
      name: "Emily Chen",
      role: "UX Researcher",
      avatar: "/placeholder-user.jpg",
      initials: "EC",
      status: "offline",
    },
    {
      name: "Michael Brown",
      role: "Backend Developer",
      avatar: "/placeholder-user.jpg",
      initials: "MB",
      status: "online",
    },
    {
      name: "Sarah Wilson",
      role: "Project Manager",
      avatar: "/placeholder-user.jpg",
      initials: "SW",
      status: "offline",
    },
  ]

  return (
    <div className="space-y-4">
      {team.slice(0, 5).map((member) => (
        <div key={member.name} className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
            <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">{member.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{member.name}</span>
            <span className="text-xs text-muted-foreground">{member.role}</span>
          </div>
          <div
            className={`ml-auto h-2 w-2 rounded-full ${member.status === "online" ? "bg-emerald-500" : "bg-gray-300"}`}
          />
        </div>
      ))}
    </div>
  )
}
