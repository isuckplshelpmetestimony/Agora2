import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Plus, ThumbsUp, Filter } from "lucide-react"

export default function FeedbackForum() {
  const feedbackItems = [
    {
      id: 1,
      title: "Improve task filtering options",
      description:
        "It would be helpful to have more advanced filtering options for tasks, such as filtering by multiple tags or assignees.",
      author: {
        name: "Emily Chen",
        avatar: "/placeholder-user.jpg",
        initials: "EC",
      },
      category: "feature",
      votes: 12,
      comments: 5,
      status: "under-review",
    },
    {
      id: 2,
      title: "Add dark mode support",
      description:
        "Would love to have a dark mode option for the entire application to reduce eye strain during night work sessions.",
      author: {
        name: "John Smith",
        avatar: "/placeholder-user.jpg",
        initials: "JS",
      },
      category: "feature",
      votes: 24,
      comments: 8,
      status: "planned",
    },
    {
      id: 3,
      title: "Calendar sync with Google Calendar",
      description:
        "It would be great if we could sync our SpeedSync calendar with Google Calendar to avoid scheduling conflicts.",
      author: {
        name: "Sarah Wilson",
        avatar: "/placeholder-user.jpg",
        initials: "SW",
      },
      category: "integration",
      votes: 18,
      comments: 3,
      status: "under-review",
    },
    {
      id: 4,
      title: "Mobile app for on-the-go access",
      description: "A mobile app would make it easier to check tasks and updates when away from the computer.",
      author: {
        name: "Michael Brown",
        avatar: "/placeholder-user.jpg",
        initials: "MB",
      },
      category: "feature",
      votes: 32,
      comments: 12,
      status: "planned",
    },
    {
      id: 5,
      title: "Fix lag when dragging tasks in QuickFlow",
      description:
        "There's a noticeable lag when dragging tasks between columns in QuickFlow, especially with many tasks.",
      author: {
        name: "Jane Doe",
        avatar: "/placeholder-user.jpg",
        initials: "JD",
      },
      category: "bug",
      votes: 8,
      comments: 4,
      status: "in-progress",
    },
  ]

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "feature":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Feature
          </Badge>
        )
      case "bug":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Bug
          </Badge>
        )
      case "integration":
        return (
          <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
            Integration
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under-review":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Under Review
          </Badge>
        )
      case "planned":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Planned
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
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
            <h1 className="text-2xl font-bold tracking-tight">Feedback Forum</h1>
            <p className="text-muted-foreground">Share and discuss ideas to improve Agora</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Feedback
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  All Feedback
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Features
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Bugs
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Integrations
                </Button>
              </CardContent>
              <CardFooter>
                <Input placeholder="Search feedback..." className="w-full" />
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="my-feedback">My Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {feedbackItems.map((item) => (
                  <Card key={item.id} className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(item.category)}
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {item.votes}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                          <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
                            {item.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{item.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {item.comments} comments
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="popular">
                <div className="text-center py-8 text-muted-foreground">Popular feedback will appear here</div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="text-center py-8 text-muted-foreground">Recent feedback will appear here</div>
              </TabsContent>

              <TabsContent value="my-feedback">
                <div className="text-center py-8 text-muted-foreground">Your feedback will appear here</div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
