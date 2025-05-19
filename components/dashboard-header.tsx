import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  return (
    <div className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 dark:border-gray-800">
      <div className="flex h-16 items-center px-6 md:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-full bg-white dark:bg-gray-800 pl-8 md:w-80 lg:w-96"
            />
          </div>
          <ThemeToggle />
          <Button variant="outline" size="icon" className="hidden h-8 w-8 md:flex">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button size="sm" className="hidden gap-1 md:flex">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
          <Button size="sm" className="gap-1 md:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
