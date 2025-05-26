"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";

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

function groupEventsByDay(events: Event[]): Record<string, Event[]> {
  return events.reduce((acc: Record<string, Event[]>, event: Event) => {
    const day = new Date(event.startTime).toLocaleDateString();
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {});
}

export default function EventsPage() {
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

  const grouped = groupEventsByDay(events);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button onClick={openCreateDialog}>+ Add Event</Button>
      </div>
      <Calendar />
      <div className="mt-8 space-y-8">
        {loading ? (
          <div className="text-center py-10">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center text-muted-foreground">No events found.</div>
        ) : (
          Object.entries(grouped).map(([day, dayEvents]) => (
            <div key={day}>
              <h2 className="text-lg font-semibold mb-2">{day}</h2>
              <div className="space-y-4">
                {dayEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-base">{event.title}</span>
                        <Badge variant={event.type === "RECURRING" ? "secondary" : "outline"}>
                          {event.type === "RECURRING" ? "Recurring" : "One-Time"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {" - "}
                        {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {event.description && <div className="text-sm mb-1">{event.description}</div>}
                      <div className="flex items-center gap-2 mt-2">
                        {event.attendees.map((user: Attendee) => (
                          <Avatar key={user.id} className="h-7 w-7">
                            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "?"} />
                            <AvatarFallback>{user.name ? user.name.split(" ").map((n: string) => n[0]).join("") : "?"}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col md:gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>Delete</Button>
                    </div>
                  </div>
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
  );
} 