import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Clock, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function QuickFlow() {
  const columns = [
    {
      id: "todo",
      title: "To Do",
      count: 4,
      tasks: [
        {
          id: "task-1",
          title: "Research competitor products",
          description: "Analyze top 5 competitors and create a comparison report",
          priority: "medium",
          assignee: {
            name: "Jane Doe",
            avatar: "/placeholder-user.jpg",
            initials: "JD",
          },
          dueDate: "May 20",
        },
        {
          id: "task-2",
          title: "Create wireframes for mobile app",
          description: "Design initial wireframes for the key screens",
          priority: "high",
          assignee: {
            name: "John Smith",
            avatar: "/placeholder-user.jpg",
            initials: "JS",
          },
          dueDate: "May 18",
        },
        {
          id: "task-3",
          title: "Update API documentation",
          description: "Review and update the API docs with new endpoints",
          priority: "low",
          assignee: {
            name: "Michael Brown",
            avatar: "/placeholder-user.jpg",
            initials: "MB",
          },
          dueDate: "May 22",
        },
        {
          id: "task-4",
          title: "Fix navigation bug on Safari",
          description: "Debug and fix the dropdown menu issue on Safari browsers",
          priority: "medium",
          assignee: {
            name: "Emily Chen",
            avatar: "/placeholder-user.jpg",
            initials: "EC",
          },
          dueDate: "May 19",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      count: 3,
      tasks: [
        {
          id: "task-5",
          title: "Implement user authentication",
          description: "Set up OAuth and email verification flows",
          priority: "high",
          assignee: {
            name: "John Smith",
            avatar: "/placeholder-user.jpg",
            initials: "JS",
          },
          dueDate: "May 17",
        },
        {
          id: "task-6",
          title: "Design dashboard UI",
          description: "Create high-fidelity mockups for the dashboard",
          priority: "medium",
          assignee: {
            name: "Jane Doe",
            avatar: "/placeholder-user.jpg",
            initials: "JD",
          },
          dueDate: "May 16",
        },
        {
          id: "task-7",
          title: "User testing preparation",
          description: "Prepare test scenarios and recruit participants",
          priority: "medium",
          assignee: {
            name: "Emily Chen",
            avatar: "/placeholder-user.jpg",
            initials: "EC",
          },
          dueDate: "May 18",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      count: 2,
      tasks: [
        {
          id: "task-8",
          title: "Landing page redesign",
          description: "Review the new landing page design and provide feedback",
          priority: "high",
          assignee: {
            name: "Sarah Wilson",
            avatar: "/placeholder-user.jpg",
            initials: "SW",
          },
          dueDate: "May 15",
        },
        {
          id: "task-9",
          title: "Performance optimization",
          description: "Review code changes for improving page load times",
          priority: "medium",
          assignee: {
            name: "Michael Brown",
            avatar: "/placeholder-user.jpg",
            initials: "MB",
          },
          dueDate: "May 16",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      count: 3,
      tasks: [
        {
          id: "task-10",
          title: "Create project roadmap",
          description: "Define milestones and timeline for Q2",
          priority: "high",
          assignee: {
            name: "Sarah Wilson",
            avatar: "/placeholder-user.jpg",
            initials: "SW",
          },
          dueDate: "May 10",
        },
        {
          id: "task-11",
          title: "Set up CI/CD pipeline",
          description: "Configure automated testing and deployment",
          priority: "medium",
          assignee: {
            name: "Michael Brown",
            avatar: "/placeholder-user.jpg",
            initials: "MB",
          },
          dueDate: "May 12",
        },
        {
          id: "task-12",
          title: "Stakeholder presentation",
          description: "Present project progress to stakeholders",
          priority: "high",
          assignee: {
            name: "Jane Doe",
            avatar: "/placeholder-user.jpg",
            initials: "JD",
          },
          dueDate: "May 14",
        },
      ],
    },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QuickFlow</h1>
            <p className="text-muted-foreground">Manage your team's tasks efficiently</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{column.title}</h3>
                  <Badge variant="secondary" className="rounded-full">
                    {column.count}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col gap-3 overflow-auto">
                {column.tasks.map((task) => (
                  <Card key={task.id} className="border-none shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="line-clamp-2 text-xs">{task.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                          <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {task.dueDate}
                      </div>
                    </CardFooter>
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
