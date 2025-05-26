"use client";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Types
type Attendee = {
  id: string;
  name?: string;
  image?: string;
};

type Event = {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: "RECURRING" | "ONE_TIME";
  attendees: Attendee[];
};

function groupEventsByDate(events: Event[]): Record<string, Event[]> {
  return events.reduce((acc: Record<string, Event[]>, event: Event) => {
    const day = new Date(event.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {});
}

export default function SpeedSync() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>("create");
  const [form, setForm] = useState({
    id: undefined as string | undefined,
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    type: "ONE_TIME" as "RECURRING" | "ONE_TIME",
    attendeeIds: [] as string[],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [users, setUsers] = useState<Attendee[]>([]);

  // Fetch users for attendee selection
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data: Attendee[]) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);

  // Fetch events
  const fetchEvents = () => {
    setLoading(true);
    setError("");
    fetch("/api/events")
      .then((r) => r.json())
      .then((data: Event[]) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load events.");
        setLoading(false);
      });
  };
  useEffect(fetchEvents, []);

  // Open dialog for create
  const openCreateDialog = () => {
    setDialogMode("create");
    setForm({
      id: undefined,
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      type: "ONE_TIME",
      attendeeIds: [],
    });
    setFormError("");
    setShowDialog(true);
  };

  // Open dialog for edit
  const openEditDialog = (event: Event) => {
    setDialogMode("edit");
    setForm({
      id: event.id,
      title: event.title,
      description: event.description || "",
      startTime: event.startTime.slice(0, 16),
      endTime: event.endTime.slice(0, 16),
      type: event.type,
      attendeeIds: event.attendees.map((a) => a.id),
    });
    setFormError("");
    setShowDialog(true);
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Handle attendee selection
  const handleAttendeeChange = (id: string) => {
    setForm((f) => ({
      ...f,
      attendeeIds: f.attendeeIds.includes(id)
        ? f.attendeeIds.filter((aid) => aid !== id)
        : [...f.attendeeIds, id],
    }));
  };

  // Handle type change
  const handleTypeChange = (val: "RECURRING" | "ONE_TIME") => {
    setForm((f) => ({ ...f, type: val }));
  };

  // Handle form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    const payload = {
      title: form.title,
      description: form.description,
      startTime: form.startTime,
      endTime: form.endTime,
      type: form.type,
      attendeeIds: form.attendeeIds,
    };
    try {
      let res;
      if (dialogMode === "create") {
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/events/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Failed to save event.");
      } else {
        setShowDialog(false);
        fetchEvents();
      }
    } catch {
      setFormError("Failed to save event.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      fetchEvents();
    } catch {}
  };

  const eventsByDate = groupEventsByDate(events);
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
            <Button size="sm" onClick={openCreateDialog}>
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
          {loading ? (
            <div className="text-center py-10">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : Object.keys(eventsByDate).length === 0 ? (
            <div className="text-center text-muted-foreground">No events found.</div>
          ) : (
            Object.entries(eventsByDate).map(([date, dateEvents]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold mb-3">{date}</h3>
                <div className="grid gap-4">
                  {dateEvents.map((event) => (
                    <Card key={event.id} className="border-none shadow-sm">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-base font-medium">{event.title}</CardTitle>
                            <CardDescription>
                              {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {" - "}
                              {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              event.type === "RECURRING"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-violet-50 text-violet-700 border-violet-200"
                            }
                          >
                            {event.type === "RECURRING" ? "Recurring" : "One-time"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{event.attendees.length} attendees</span>
                          <div className="flex -space-x-2 ml-2">
                            {event.attendees.slice(0, 3).map((attendee) => (
                              <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={attendee.image || "/placeholder.svg"} alt={attendee.name || "?"} />
                                <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
                                  {attendee.name ? attendee.name.split(" ").map((n: string) => n[0]).join("") : "?"}
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
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "create" ? "Add Event" : "Edit Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <Input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleFormChange}
                required
                disabled={formLoading}
              />
              <Textarea
                name="description"
                placeholder="Description (optional)"
                value={form.description}
                onChange={handleFormChange}
                disabled={formLoading}
              />
              <div className="flex gap-2">
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={handleFormChange}
                  required
                  disabled={formLoading}
                />
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={handleFormChange}
                  required
                  disabled={formLoading}
                />
              </div>
              <div className="flex gap-2 items-center">
                <span>Type:</span>
                <Select value={form.type} onValueChange={handleTypeChange} disabled={formLoading}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_TIME">One-Time</SelectItem>
                    <SelectItem value="RECURRING">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="mb-1">Attendees:</div>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => (
                    <Button
                      key={user.id}
                      type="button"
                      variant={form.attendeeIds.includes(user.id) ? "default" : "outline"}
                      className="flex items-center gap-2 px-2 py-1 h-auto"
                      onClick={() => handleAttendeeChange(user.id)}
                      disabled={formLoading}
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "?"} />
                        <AvatarFallback>{user.name ? user.name.split(" ").map((n: string) => n[0]).join("") : "?"}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{user.name || user.id}</span>
                    </Button>
                  ))}
                </div>
              </div>
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <DialogFooter>
                <Button onClick={() => setShowDialog(false)} variant="outline" type="button" disabled={formLoading}>Cancel</Button>
                <Button type="submit" disabled={formLoading}>{formLoading ? "Saving..." : "Save"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
