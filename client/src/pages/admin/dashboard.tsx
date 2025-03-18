import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users, FileText, Settings } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { ReportManagement } from '@/components/admin/ReportManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin or sudo
    if (user && user.role !== 'admin' && user.role !== 'sudo') {
      setLocation('/');
    }
  }, [user, setLocation]);

  if (!user || (user.role !== 'admin' && user.role !== 'sudo')) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Manage users, reports, and system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center"
                disabled={user.role !== 'sudo'}
              >
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              <UserManagement isSudo={user.role === 'sudo'} />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <ReportManagement />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              {user.role === 'sudo' ? (
                <SystemSettings />
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Only sudo users can access system settings.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}