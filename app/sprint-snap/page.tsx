import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Clock, FileText, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function SprintSnap() {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sprint Snap</h1>
            <p className="text-muted-foreground">Current sprint: May 10 - May 24, 2025</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Previous Sprints
            </Button>
            <Button size="sm">
              <Zap className="mr-2 h-4 w-4" />
              Sprint Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">68%</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Clock className="mr-1 h-3 w-3" />4 days remaining
                </Badge>
              </div>
              <Progress value={68} className="h-2 mb-4" />
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Total</span>
                  <p className="font-medium">24</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Completed</span>
                  <p className="font-medium">16</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Remaining</span>
                  <p className="font-medium">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">42 points</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +8 from last sprint
                </Badge>
              </div>
              <div className="h-[60px] w-full bg-muted/30 rounded-md flex items-end justify-between px-2">
                <div className="w-1/5 h-[30%] bg-amber-200 rounded-t-sm"></div>
                <div className="w-1/5 h-[45%] bg-amber-300 rounded-t-sm"></div>
                <div className="w-1/5 h-[60%] bg-amber-400 rounded-t-sm"></div>
                <div className="w-1/5 h-[50%] bg-amber-500 rounded-t-sm"></div>
                <div className="w-1/5 h-[70%] bg-amber-600 rounded-t-sm"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Sprint 1</span>
                <span>Sprint 2</span>
                <span>Sprint 3</span>
                <span>Sprint 4</span>
                <span>Current</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sprint Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">Good</span>
                <div className="flex -space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">JS</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">EC</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium border-2 border-background">
                    +2
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scope changes</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Low
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Blockers</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Medium
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team morale</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    High
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="tasks">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="burndown">Burndown Chart</TabsTrigger>
              <TabsTrigger value="team">Team Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Sprint Tasks</CardTitle>
                  <CardDescription>All tasks in the current sprint</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((task) => (
                      <div key={task} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <FileText className="h-4 w-4 text-amber-700" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">Task {task}: Implement feature X</p>
                            <Badge variant={task % 2 === 0 ? "outline" : "secondary"}>
                              {task % 2 === 0 ? "In Progress" : "Completed"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Assigned to: Team Member {task}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>3 story points</span>
                            <span>•</span>
                            <span>Due: May {18 + task}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="burndown">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Burndown Chart</CardTitle>
                  <CardDescription>Sprint progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full flex items-end">
                    <div className="h-full w-full bg-muted/30 rounded-md p-4 flex items-end">
                      <div className="relative w-full h-full">
                        {/* Ideal burndown line */}
                        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-dashed border-muted-foreground/30"></div>

                        {/* Actual burndown line */}
                        <svg
                          className="absolute top-0 left-0 w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <polyline
                            points="0,0 20,10 40,25 60,35 80,60 100,68"
                            fill="none"
                            stroke="#d97706"
                            strokeWidth="2"
                          />
                        </svg>

                        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-muted-foreground">
                          <span>May 10</span>
                          <span>May 14</span>
                          <span>May 17</span>
                          <span>May 20</span>
                          <span>May 24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Individual contributions to the sprint</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { name: "Jane Doe", role: "Product Designer", tasks: 5, completed: 4, points: 12 },
                      { name: "John Smith", role: "Frontend Developer", tasks: 6, completed: 3, points: 9 },
                      { name: "Emily Chen", role: "UX Researcher", tasks: 4, completed: 3, points: 7 },
                      { name: "Michael Brown", role: "Backend Developer", tasks: 5, completed: 4, points: 10 },
                      { name: "Sarah Wilson", role: "Project Manager", tasks: 4, completed: 2, points: 4 },
                    ].map((member) => (
                      <div key={member.name} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-user.jpg" alt={member.name} />
                          <AvatarFallback className="bg-amber-100 text-amber-800">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                            <div className="text-sm font-medium">{member.points} points</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={(member.completed / member.tasks) * 100} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground">
                              {member.completed}/{member.tasks} tasks
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
