"use client";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Clock, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STATUS_COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review" },
  { id: "DONE", title: "Done" },
]
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"]

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignee?: {
    id: string;
    name?: string;
    image?: string;
    email?: string;
  };
  boardId: string;
  assigneeId: string;
};

export default function QuickFlow() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
    boardId: "",
  })
  const [users, setUsers] = useState<{id: string, name?: string, email?: string}[]>([])
  const [boards, setBoards] = useState<{id: string, name: string}[]>([])
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  // Fetch users and boards for form dropdowns
  useEffect(() => {
    fetch("/api/users")
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
    fetch("/api/boards")
      .then(r => r.json())
      .then(data => setBoards(Array.isArray(data) ? data : []))
      .catch(() => setBoards([]))
  }, [])

  // Fetch all tasks
  const fetchTasks = () => {
    setLoading(true)
    setError("")
    fetch("/api/tasks")
      .then(r => r.json())
      .then(data => {
        setTasks(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load tasks.")
        setLoading(false)
      })
  }
  useEffect(fetchTasks, [])

  // Group tasks by status
  const grouped: Record<string, Task[]> = {}
  STATUS_COLUMNS.forEach(col => { grouped[col.id] = [] })
  tasks.forEach((task: Task) => {
    if (grouped[task.status]) grouped[task.status].push(task)
  })

  // Handle drag and drop
  const onDragStart = (task: Task) => setDraggedTask(task)
  const onDrop = (status: string) => {
    if (!draggedTask || draggedTask.status === status) return
    fetch(`/api/tasks/${draggedTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draggedTask, status }),
    })
      .then(r => r.json())
      .then(() => {
        fetchTasks()
        setDraggedTask(null)
      })
      .catch(() => setError("Failed to update task status."))
  }

  // Handle create task
  const handleCreate = () => {
    setCreating(true)
    setCreateError("")
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error)
        return r.json()
      })
      .then(() => {
        setShowCreate(false)
        setForm({ title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: "", assigneeId: "", boardId: "" })
        fetchTasks()
      })
      .catch(e => setCreateError(e.message || "Failed to create task."))
      .finally(() => setCreating(false))
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>
      case "MEDIUM":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>
      case "LOW":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>
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
            <Button variant="outline" size="sm">Filter</Button>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-10">Loading tasks...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {STATUS_COLUMNS.map((col) => (
              <div key={col.id} className="flex flex-col" onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.id)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{col.title}</h3>
                    <Badge variant="secondary" className="rounded-full">{grouped[col.id]?.length || 0}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowCreate(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-3 overflow-auto min-h-[40px]">
                  {grouped[col.id]?.map((task) => (
                    <Card key={task.id} className="border-none shadow-sm" draggable onDragStart={() => onDragStart(task)}>
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
                            <AvatarImage src={task.assignee?.image || "/placeholder.svg"} alt={task.assignee?.name || "?"} />
                            <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
                              {task.assignee?.name ? task.assignee.name.split(" ").map(n => n[0]).join("") : "?"}
                            </AvatarFallback>
                          </Avatar>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {STATUS_COLUMNS.map(col => <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            <Select value={form.assigneeId} onValueChange={v => setForm(f => ({ ...f, assigneeId: v }))}>
              <SelectTrigger><SelectValue placeholder="Assignee" /></SelectTrigger>
              <SelectContent>
                {Array.isArray(users) && users.map((u: {id: string, name?: string, email?: string}) => (
                  <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={form.boardId} onValueChange={v => setForm(f => ({ ...f, boardId: v }))}>
              <SelectTrigger><SelectValue placeholder="Board" /></SelectTrigger>
              <SelectContent>
                {boards.map((b: {id: string, name: string}) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {createError && <div className="text-red-500 text-sm">{createError}</div>}
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={creating}>{creating ? "Creating..." : "Create Task"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
