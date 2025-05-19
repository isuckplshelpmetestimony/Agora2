import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function SpeedSync() {
  // Sample data for calendar events
  const events = [
    {
      id: 1,
      title: "Team Standup",
      date: "Monday, May 17",
      time: "9:00 AM - 9:30 AM",
      attendees: [
        { name: "Jane Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
        { name: "John Smith", avatar: "/placeholder-user.jpg", initials: "JS" },
        { name: "Emily Chen", avatar: "/placeholder-user.jpg", initials: "EC" },
        { name: "Michael Brown", avatar: "/placeholder-user.jpg", initials: "MB" },
      ],
      type: "recurring",
    },
    {
      id: 2,
      title: "Design Review",
      date: "Monday, May 17",
      time: "11:00 AM - 12:00 PM",
      attendees: [
        { name: "Jane Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
        { name: "Sarah Wilson", avatar: "/placeholder-user.jpg", initials: "SW" },
      ],
      type: "one-time",
    },
    {
      id: 3,
      title: "Product Strategy",
      date: "Monday, May 17",
      time: "2:00 PM - 3:30 PM",
      attendees: [
        { name: "Jane Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
        { name: "John Smith", avatar: "/placeholder-user.jpg", initials: "JS" },
        { name: "Sarah Wilson", avatar: "/placeholder-user.jpg", initials: "SW" },
      ],
      type: "one-time",
    },
    {
      id: 4,
      title: "Sprint Planning",
      date: "Tuesday, May 18",
      time: "10:00 AM - 11:30 AM",
      attendees: [
        { name: "Jane Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
        { name: "John Smith", avatar: "/placeholder-user.jpg", initials: "JS" },
        { name: "Emily Chen", avatar: "/placeholder-user.jpg", initials: "EC" },
        { name: "Michael Brown", avatar: "/placeholder-user.jpg", initials: "MB" },
        { name: "Sarah Wilson", avatar: "/placeholder-user.jpg", initials: "SW" },
      ],
      type: "recurring",
    },
    {
      id: 5,
      title: "User Testing Review",
      date: "Wednesday, May 19",
      time: "1:00 PM - 2:00 PM",
      attendees: [
        { name: "Jane Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
        { name: "Emily Chen", avatar: "/placeholder-user.jpg", initials: "EC" },
      ],
      type: "one-time",
    },
  ]

  // Group events by date
  const eventsByDate = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = []
      }
      acc[event.date].push(event)
      return acc
    },
    {} as Record<string, typeof events>,
  )

  // Calendar days
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SpeedSync</h1>
            <p className="text-muted-foreground">Manage your meetings and events</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Today
            </Button>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium mx-2">May 17-23, 2025</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Select defaultValue="week">
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </div>
        </div>

        {/* Calendar Week View */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {days.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium mb-1">{day}</div>
              <div
                className={`text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center mx-auto ${index === 0 ? "bg-amber-100 text-amber-800" : ""}`}
              >
                {17 + index}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          {Object.entries(eventsByDate).map(([date, dateEvents]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-3">{date}</h3>
              <div className="grid gap-4">
                {dateEvents.map((event) => (
                  <Card key={event.id} className="border-none shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-base font-medium">{event.title}</CardTitle>
                          <CardDescription>{event.time}</CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            event.type === "recurring"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-violet-50 text-violet-700 border-violet-200"
                          }
                        >
                          {event.type === "recurring" ? "Recurring" : "One-time"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{event.attendees.length} attendees</span>
                        <div className="flex -space-x-2 ml-2">
                          {event.attendees.slice(0, 3).map((attendee) => (
                            <Avatar key={attendee.name} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                              <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
                                {attendee.initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {event.attendees.length > 3 && (
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium">
                              +{event.attendees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
