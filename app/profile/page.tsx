import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, CheckCircle2, MessageSquare, Upload, User } from "lucide-react"
import { getCurrentUser } from "@/app/auth"
import { Activity, User as UserType } from "@prisma/client"
import ProfileClient from "./client"

async function getProfile() {
  const res = await fetch('/api/profile')
  if (!res.ok) {
    throw new Error('Failed to fetch profile')
  }
  return res.json()
}

export default async function Profile() {
  const userData = await getProfile()
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return (
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Not Authorized</CardTitle>
              <CardDescription>Please log in to view your profile.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        {/* @ts-expect-error Server Component */}
        <ProfileClient initialData={userData} />
      </div>
    </div>
  );
}
