import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Setup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Redirect if user is not logged in
  React.useEffect(() => {
    if (!user) {
      setLocation("/login");
      toast({
        title: "Authentication required",
        description: "Please log in to access the setup page.",
        variant: "destructive",
      });
    }
  }, [user, setLocation, toast]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Setup</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Complete your profile information to get the most out of S.H.I.E.L.D.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your profile is {user.profileCompleted ? "complete" : "incomplete"}.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setLocation("/profile")}>
              {user.profileCompleted ? "Edit Profile" : "Complete Profile"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              Choose a subscription plan that fits your needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Current plan: <span className="font-medium">{user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}</span>
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setLocation("/subscription")}>
              {user.subscriptionTier === "free" ? "Upgrade Plan" : "Manage Subscription"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}