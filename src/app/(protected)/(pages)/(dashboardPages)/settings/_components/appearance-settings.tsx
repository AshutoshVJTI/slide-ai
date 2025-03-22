"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserPreferences } from "@/actions/user";
import { useTheme } from "@/provider/theme-provider";

const AppearanceSettings = () => {
  const router = useRouter();
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize
  } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      
      // Call server action to update preferences
      const response = await updateUserPreferences(
        theme, 
        false, // We're removing the reduceMotion toggle, so we'll just pass false
        fontSize
      );
      
      if (response.status === 200) {
        // Theme provider already saves to localStorage
        toast.success("Appearance settings saved");
        router.refresh();
      } else {
        toast.error("Failed to save appearance settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save appearance settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Theme</h3>
              <p className="text-xs text-muted-foreground">
                Select your preferred application theme
              </p>
            </div>
            <Select 
              value={theme} 
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Font Size</h3>
              <p className="text-xs text-muted-foreground">
                Adjust the font size throughout the application
              </p>
            </div>
            <Select 
              value={fontSize}
              onValueChange={(value) => setFontSize(value as "small" | "medium" | "large")}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSaveChanges}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSettings; 