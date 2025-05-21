'use client';

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar, CheckCircle2, MessageSquare, Upload, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

type Activity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  metadata: any;
};

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  jobTitle: string | null;
  phoneNumber: string | null;
  website: string | null;
  createdAt: string;
  activities: Activity[];
};

interface ProfileClientProps {
  initialData: UserData;
}

export default function ProfileClient({ initialData }: ProfileClientProps) {
  const [userData, setUserData] = useState<UserData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: userData.name || '',
    bio: userData.bio || '',
    location: userData.location || '',
    jobTitle: userData.jobTitle || '',
    phoneNumber: userData.phoneNumber || '',
    website: userData.website || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setUserData(data.user);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would:
    // 1. Create a FormData object and append the file
    // 2. Send it to your API endpoint for upload
    // 3. Get back the URL of the uploaded image
    
    // For this example, we'll simulate by using a placeholder URL
    const simulatedImageUrl = `/placeholder-user.jpg?${Date.now()}`;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: simulatedImageUrl })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }
      
      setUserData(prev => ({
        ...prev,
        image: simulatedImageUrl
      }));
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM yyyy');
  };

  // Get initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:items-start">
      <div className="md:w-1/3">
        <Card className="border-none shadow-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.image || "/placeholder-user.jpg"} alt={userData.name || "User"} />
                <AvatarFallback className="bg-amber-100 text-amber-800 text-xl">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{userData.name || "User"}</CardTitle>
            <CardDescription>{userData.jobTitle || ""}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-2">
              {userData.jobTitle && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {userData.jobTitle}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{userData.email}</span>
              </div>
              {userData.location && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {userData.createdAt ? formatDate(userData.createdAt) : ""}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <label htmlFor="image-upload" className="w-full">
                <div className="cursor-pointer">
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
                <input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-sm mt-6">
          <CardHeader>
            <CardTitle className="text-base">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userData.activities && userData.activities.length > 0 ? (
              userData.activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activity.type === "PROFILE_UPDATE" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    {activity.type === "PROFILE_PICTURE_UPDATE" && (
                      <Upload className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm">{activity.description}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(activity.createdAt), 'MMM d')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No recent activity</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:w-2/3">
        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleProfileUpdate}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and how others see you on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name || ''} 
                      onChange={handleInputChange} 
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input 
                      id="jobTitle" 
                      name="jobTitle" 
                      value={formData.jobTitle || ''} 
                      onChange={handleInputChange} 
                      placeholder="Your job title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={formData.bio || ''} 
                      onChange={handleInputChange} 
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        value={formData.location || ''} 
                        onChange={handleInputChange} 
                        placeholder="Your location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber" 
                        name="phoneNumber" 
                        value={formData.phoneNumber || ''} 
                        onChange={handleInputChange} 
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      value={formData.website || ''} 
                      onChange={handleInputChange} 
                      placeholder="Your website URL"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={userData.email || ''} disabled />
                  <p className="text-xs text-muted-foreground">Your email address is used for login and notifications.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive notifications and updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Notification settings will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}