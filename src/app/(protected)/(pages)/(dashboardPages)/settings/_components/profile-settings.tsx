"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ProfileSettingsProps {
  user: User;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real implementation, you would use something like react-dropzone for file uploads
  const handleAvatarChange = () => {
    toast("Feature not yet implemented", {
      description: "Avatar change functionality will be added soon"
    });
  };
  
  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await updateUserProfile(name);
      
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        router.refresh();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and public profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.substring(0, 2)?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 sm:mt-0"
              onClick={handleAvatarChange}
            >
              Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled />
            <p className="text-xs text-muted-foreground">
              Your email is managed by your account provider
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleProfileUpdate}
          disabled={isLoading || name === user?.name}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings; 