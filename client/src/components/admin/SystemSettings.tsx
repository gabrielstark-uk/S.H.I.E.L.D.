import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, RefreshCw } from 'lucide-react';

export function SystemSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // These would typically be loaded from the server
  const [settings, setSettings] = useState({
    general: {
      siteName: 'S.H.I.E.L.D. Protection System',
      contactEmail: 'admin@shield-protection.com',
      enableRegistration: true,
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 24
    },
    security: {
      enableTwoFactor: true,
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      passwordRequireNumbers: true,
      passwordRequireUppercase: true,
      maxSessionsPerUser: 3
    },
    notifications: {
      enableEmailNotifications: true,
      enableAdminAlerts: true,
      alertsEmail: 'alerts@shield-protection.com',
      dailyReportSummary: true,
      weeklyReportSummary: true
    }
  });

  const handleSaveSettings = () => {
    setError(null);
    setSuccess(null);
    
    // In a real application, this would send the settings to the server
    setTimeout(() => {
      setSuccess('Settings saved successfully');
    }, 1000);
  };

  // Only sudo users should be able to access this component
  if (user?.role !== 'sudo') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Only sudo users can access system settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">System Settings</h2>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        siteName: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        contactEmail: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    type="number"
                    value={settings.general.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        maxLoginAttempts: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    value={settings.general.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        sessionTimeout: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableRegistration" 
                    checked={settings.general.enableRegistration}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        enableRegistration: checked
                      }
                    })}
                  />
                  <Label htmlFor="enableRegistration">Enable User Registration</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="requireEmailVerification" 
                    checked={settings.general.requireEmailVerification}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        requireEmailVerification: checked
                      }
                    })}
                  />
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure system security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input 
                    id="passwordMinLength" 
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordMinLength: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxSessionsPerUser">Max Sessions Per User</Label>
                  <Input 
                    id="maxSessionsPerUser" 
                    type="number"
                    value={settings.security.maxSessionsPerUser}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        maxSessionsPerUser: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableTwoFactor" 
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        enableTwoFactor: checked
                      }
                    })}
                  />
                  <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="passwordRequireSpecialChars" 
                    checked={settings.security.passwordRequireSpecialChars}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordRequireSpecialChars: checked
                      }
                    })}
                  />
                  <Label htmlFor="passwordRequireSpecialChars">Require Special Characters</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="passwordRequireNumbers" 
                    checked={settings.security.passwordRequireNumbers}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordRequireNumbers: checked
                      }
                    })}
                  />
                  <Label htmlFor="passwordRequireNumbers">Require Numbers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="passwordRequireUppercase" 
                    checked={settings.security.passwordRequireUppercase}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordRequireUppercase: checked
                      }
                    })}
                  />
                  <Label htmlFor="passwordRequireUppercase">Require Uppercase Letters</Label>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alertsEmail">Alerts Email</Label>
                <Input 
                  id="alertsEmail" 
                  type="email"
                  value={settings.notifications.alertsEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      alertsEmail: e.target.value
                    }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableEmailNotifications" 
                    checked={settings.notifications.enableEmailNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableEmailNotifications: checked
                      }
                    })}
                  />
                  <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableAdminAlerts" 
                    checked={settings.notifications.enableAdminAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableAdminAlerts: checked
                      }
                    })}
                  />
                  <Label htmlFor="enableAdminAlerts">Enable Admin Alerts</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="dailyReportSummary" 
                    checked={settings.notifications.dailyReportSummary}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        dailyReportSummary: checked
                      }
                    })}
                  />
                  <Label htmlFor="dailyReportSummary">Daily Report Summary</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="weeklyReportSummary" 
                    checked={settings.notifications.weeklyReportSummary}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        weeklyReportSummary: checked
                      }
                    })}
                  />
                  <Label htmlFor="weeklyReportSummary">Weekly Report Summary</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}