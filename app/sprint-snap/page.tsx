'use client';
import useSWR from 'swr';
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Clock, FileText, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useMemo } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SprintSnap() {
  // Fetch all sprints (for now, use the first as current)
  const { data: sprints, isLoading: sprintsLoading } = useSWR('/api/sprints', fetcher);
  // Fetch all tasks (for now, filter by current sprint)
  const { data: tasks, isLoading: tasksLoading } = useSWR('/api/tasks', fetcher);

  const currentSprint = useMemo(() => sprints?.[0], [sprints]);
  const sprintTasks = useMemo(() => {
    if (!tasks || !currentSprint) return [];
    return tasks.filter((t: any) => t.sprintId === currentSprint.id);
  }, [tasks, currentSprint]);

  if (sprintsLoading || tasksLoading) return <div className="p-8">Loading...</div>;
  if (!currentSprint) return <div className="p-8">No sprint found.</div>;

  // Calculate progress
  const totalTasks = sprintTasks.length;
  const completedTasks = sprintTasks.filter((t: any) => t.status === 'DONE').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Velocity, health, burndown, teamPerformance from sprint
  const velocity = currentSprint.velocity ?? 0;
  const health = currentSprint.health ?? 'Unknown';
  const burndownData = currentSprint.burndownData ?? [];
  const teamPerformance = currentSprint.teamPerformance ?? [];

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sprint Snap</h1>
            <p className="text-muted-foreground">
              Current sprint: {new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}
            </p>
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
                <span className="text-2xl font-bold">{progress}%</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Clock className="mr-1 h-3 w-3" />
                  {Math.max(0, Math.ceil((new Date(currentSprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
                </Badge>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Total</span>
                  <p className="font-medium">{totalTasks}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Completed</span>
                  <p className="font-medium">{completedTasks}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Remaining</span>
                  <p className="font-medium">{totalTasks - completedTasks}</p>
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
                <span className="text-2xl font-bold">{velocity} points</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {/* Placeholder for velocity change */}
                  +0 from last sprint
                </Badge>
              </div>
              {/* You can visualize velocity history here if you have it */}
              <div className="h-[60px] w-full bg-muted/30 rounded-md flex items-end justify-between px-2">
                {/* Placeholder bars */}
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
                <span className="text-2xl font-bold">{health}</span>
                {/* You can map team members here if you have them in teamPerformance */}
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
              {/* You can show more health metrics here if available */}
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
                    {sprintTasks.map((task: any) => (
                      <div key={task.id} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <FileText className="h-4 w-4 text-amber-700" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{task.title}</p>
                            <Badge variant={task.status === 'DONE' ? "secondary" : "outline"}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Assigned to: {task.assignee?.name || 'Unassigned'}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{task.storyPoints ?? 0} story points</span>
                            <span>•</span>
                            <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
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
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Day</th>
                        <th className="text-left p-2">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {burndownData.map((point: any) => (
                        <tr key={point.day}>
                          <td className="p-2">{point.day}</td>
                          <td className="p-2">{point.remaining}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Points</th>
                        <th className="text-left p-2">Tasks</th>
                        <th className="text-left p-2">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPerformance.map((member: any) => (
                        <tr key={member.id}>
                          <td className="p-2">{member.name}</td>
                          <td className="p-2">{member.points}</td>
                          <td className="p-2">{member.tasks}</td>
                          <td className="p-2">{member.completed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
