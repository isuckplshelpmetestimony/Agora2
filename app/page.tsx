import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle2, Clock, Coffee, MessageSquare, Sparkles, Zap } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecentActivity } from "@/components/recent-activity"
import { TeamMembers } from "@/components/team-members"
import { TaskProgress } from "@/components/task-progress"

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-6 p-6 pt-0 md:p-8 md:pt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12/24</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
              <Zap className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">4 days remaining</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next: Design Review (2h)</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Feedback Items</CardTitle>
              <MessageSquare className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">2 new since last week</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-6">
          <Card className="col-span-6 md:col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Current Sprint</CardTitle>
              <CardDescription>May 10 - May 24, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="progress">
                <TabsList className="mb-4">
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                <TabsContent value="progress">
                  <TaskProgress />
                </TabsContent>
                <TabsContent value="tasks">
                  <div className="text-sm text-muted-foreground">Task list will appear here</div>
                </TabsContent>
                <TabsContent value="timeline">
                  <div className="text-sm text-muted-foreground">Sprint timeline will appear here</div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card className="col-span-6 md:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>8 members</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembers />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-6">
          <Card className="col-span-6 md:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from the team</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
          <Card className="col-span-6 md:col-span-3 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Daily Focus</CardTitle>
                <CardDescription>Your priorities for today</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <Coffee className="mr-2 h-4 w-4" />
                Take a break
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                    <Sparkles className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Finalize homepage design</p>
                    <p className="text-xs text-muted-foreground">High priority • Due today</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">2h</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <MessageSquare className="h-4 w-4 text-blue-700" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Review feedback from user testing</p>
                    <p className="text-xs text-muted-foreground">Medium priority • Due tomorrow</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">1h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
