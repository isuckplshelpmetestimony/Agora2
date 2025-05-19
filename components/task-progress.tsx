import { Progress } from "@/components/ui/progress"

export function TaskProgress() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Design</div>
          <div className="text-sm text-muted-foreground">85%</div>
        </div>
        <Progress value={85} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Development</div>
          <div className="text-sm text-muted-foreground">62%</div>
        </div>
        <Progress value={62} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Marketing</div>
          <div className="text-sm text-muted-foreground">45%</div>
        </div>
        <Progress value={45} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Research</div>
          <div className="text-sm text-muted-foreground">78%</div>
        </div>
        <Progress value={78} className="h-2" />
      </div>
    </div>
  )
}
