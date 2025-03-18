import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLocation } from 'wouter';
import { Loader2, AlertCircle, User, Settings, Bell, Shield, MapPin } from 'lucide-react';
import { UKSettings } from '@/components/uk-settings';

export default function Profile() {
  const { user, updateProfile, isLoading, error } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('account');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Account form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Detection settings state
  const [detectionSettings, setDetectionSettings] = useState({
    soundCannonThreshold: user?.preferences?.detectionSettings?.soundCannonThreshold || 200,
    v2kThreshold: user?.preferences?.detectionSettings?.v2kThreshold || 180,
    autoActivateCountermeasures: user?.preferences?.detectionSettings?.autoActivateCountermeasures !== false,
    sensitivityLevel: user?.preferences?.detectionSettings?.sensitivityLevel || 'medium',
    enableGeolocation: user?.preferences?.detectionSettings?.enableGeolocation !== false,
    alertVolume: user?.preferences?.detectionSettings?.alertVolume || 0.8,
    countermeasureType: user?.preferences?.detectionSettings?.countermeasureType || 'standard',
    enableAutomaticReporting: user?.preferences?.detectionSettings?.enableAutomaticReporting || false,
    policeForceEmail: user?.preferences?.detectionSettings?.policeForceEmail || '',
    localPoliceStation: user?.preferences?.detectionSettings?.localPoliceStation || '',
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email: user?.preferences?.notifications?.email !== false,
    push: user?.preferences?.notifications?.push !== false,
    detectionAlerts: user?.preferences?.notifications?.detectionAlerts !== false,
    reportUpdates: user?.preferences?.notifications?.reportUpdates !== false,
    newFeatures: user?.preferences?.notifications?.newFeatures !== false,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <User className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-xl text-muted-foreground">
            Please log in to view your profile
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => setLocation('/login')}>
              Log In
            </Button>
            <Button variant="outline" onClick={() => setLocation('/register')}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        firstName,
        lastName,
        email,
      });
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setFormError('Failed to update profile');
    }
  };

  const handleDetectionSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        preferences: {
          ...user.preferences,
          detectionSettings,
        },
      });
      setSuccessMessage('Detection settings updated successfully');
    } catch (err) {
      setFormError('Failed to update detection settings');
    }
  };

  const handleNotificationSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        preferences: {
          ...user.preferences,
          notifications: notificationSettings,
        },
      });
      setSuccessMessage('Notification settings updated successfully');
    } catch (err) {
      setFormError('Failed to update notification settings');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
            {user.firstName?.[0] || user.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Your Profile'}</h1>
            <p className="text-muted-foreground">
              Member since {new Date(user.createdAt).toLocaleDateString()}
              {user.subscriptionTier !== 'free' && ` • ${user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)} Plan`}
            </p>
          </div>
        </div>

        <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="detection" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Detection
            </TabsTrigger>
            <TabsTrigger value="uk-settings" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              UK Settings
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAccountSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {formError && activeTab === 'account' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && activeTab === 'account' && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Subscription Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.subscriptionTier === 'free'
                            ? 'You are currently on the Free plan'
                            : `You are currently on the ${user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)} plan`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setLocation('/subscription')}
                      >
                        {user.subscriptionTier === 'free' ? 'Upgrade' : 'Manage'} Subscription
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="uk-settings">
            <UKSettings
              settings={{
                enableAutomaticReporting: detectionSettings.enableAutomaticReporting,
                policeForceEmail: detectionSettings.policeForceEmail,
                localPoliceStation: detectionSettings.localPoliceStation
              }}
              onSave={(ukSettings) => {
                setDetectionSettings({
                  ...detectionSettings,
                  enableAutomaticReporting: ukSettings.enableAutomaticReporting,
                  policeForceEmail: ukSettings.policeForceEmail,
                  localPoliceStation: ukSettings.localPoliceStation
                });

                updateProfile({
                  preferences: {
                    ...user.preferences,
                    detectionSettings: {
                      ...detectionSettings,
                      enableAutomaticReporting: ukSettings.enableAutomaticReporting,
                      policeForceEmail: ukSettings.policeForceEmail,
                      localPoliceStation: ukSettings.localPoliceStation
                    }
                  }
                }).then(() => {
                  setSuccessMessage('UK settings updated successfully');
                }).catch(() => {
                  setFormError('Failed to update UK settings');
                });
              }}
            />
          </TabsContent>

          <TabsContent value="detection">
            <Card>
              <CardHeader>
                <CardTitle>Detection Settings</CardTitle>
                <CardDescription>
                  Customize how FrequencyGuard detects and responds to threats
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleDetectionSettingsSubmit}>
                <CardContent className="space-y-6">
                  {formError && activeTab === 'detection' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && activeTab === 'detection' && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Sensitivity Level</h3>
                      <Select
                        value={detectionSettings.sensitivityLevel}
                        onValueChange={(value) =>
                          setDetectionSettings({
                            ...detectionSettings,
                            sensitivityLevel: value as 'low' | 'medium' | 'high',
                          })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sensitivity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Fewer false positives)</SelectItem>
                          <SelectItem value="medium">Medium (Balanced)</SelectItem>
                          <SelectItem value="high">High (Maximum detection)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="soundCannonThreshold">Sound Cannon Detection Threshold</Label>
                        <span className="text-sm">{detectionSettings.soundCannonThreshold}</span>
                      </div>
                      <Slider
                        id="soundCannonThreshold"
                        min={100}
                        max={300}
                        step={5}
                        value={[detectionSettings.soundCannonThreshold]}
                        onValueChange={(value) =>
                          setDetectionSettings({
                            ...detectionSettings,
                            soundCannonThreshold: value[0],
                          })
                        }
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower values increase sensitivity but may cause more false positives
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="v2kThreshold">V2K Detection Threshold</Label>
                        <span className="text-sm">{detectionSettings.v2kThreshold}</span>
                      </div>
                      <Slider
                        id="v2kThreshold"
                        min={100}
                        max={300}
                        step={5}
                        value={[detectionSettings.v2kThreshold]}
                        onValueChange={(value) =>
                          setDetectionSettings({
                            ...detectionSettings,
                            v2kThreshold: value[0],
                          })
                        }
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower values increase sensitivity but may cause more false positives
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="alertVolume">Alert Volume</Label>
                        <span className="text-sm">{Math.round(detectionSettings.alertVolume * 100)}%</span>
                      </div>
                      <Slider
                        id="alertVolume"
                        min={0}
                        max={1}
                        step={0.05}
                        value={[detectionSettings.alertVolume]}
                        onValueChange={(value) =>
                          setDetectionSettings({
                            ...detectionSettings,
                            alertVolume: value[0],
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Countermeasure Type</h3>
                      <Select
                        value={detectionSettings.countermeasureType}
                        onValueChange={(value) =>
                          setDetectionSettings({
                            ...detectionSettings,
                            countermeasureType: value as 'standard' | 'advanced' | 'custom',
                          })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select countermeasure type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Advanced countermeasures are more effective but use more resources
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoActivateCountermeasures">Auto-Activate Countermeasures</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically activate countermeasures when threats are detected
                        </p>
                      </div>
                      <Switch
                        id="autoActivateCountermeasures"
                        checked={detectionSettings.autoActivateCountermeasures}
                        onCheckedChange={(checked) =>
                          setDetectionSettings({
                            ...detectionSettings,
                            autoActivateCountermeasures: checked,
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableGeolocation">Enable Geolocation</Label>
                        <p className="text-xs text-muted-foreground">
                          Include your location data in threat reports
                        </p>
                      </div>
                      <Switch
                        id="enableGeolocation"
                        checked={detectionSettings.enableGeolocation}
                        onCheckedChange={(checked) =>
                          setDetectionSettings({
                            ...detectionSettings,
                            enableGeolocation: checked,
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDetectionSettings({
                                              soundCannonThreshold: 200,
                                              v2kThreshold: 180,
                                              autoActivateCountermeasures: true,
                                              sensitivityLevel: 'medium',
                                              enableGeolocation: true,
                                              alertVolume: 0.8,
                                              countermeasureType: 'standard',
                                              enableAutomaticReporting: false,
                                              policeForceEmail: '',
                                              localPoliceStation: '',
                                            });
                    }}
                    disabled={isLoading}
                  >
                    Reset to Defaults
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleNotificationSettingsSubmit}>
                <CardContent className="space-y-6">
                  {formError && activeTab === 'notifications' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && activeTab === 'notifications' && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Channels</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email: checked,
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            push: checked,
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div className="pt-4">
                      <h3 className="font-medium mb-4">Notification Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="detectionAlerts">Detection Alerts</Label>
                            <p className="text-xs text-muted-foreground">
                              Notifications about new threat detections
                            </p>
                          </div>
                          <Switch
                            id="detectionAlerts"
                            checked={notificationSettings.detectionAlerts}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                detectionAlerts: checked,
                              })
                            }
                            disabled={isLoading}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="reportUpdates">Report Updates</Label>
                            <p className="text-xs text-muted-foreground">
                              Updates about your submitted reports
                            </p>
                          </div>
                          <Switch
                            id="reportUpdates"
                            checked={notificationSettings.reportUpdates}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                reportUpdates: checked,
                              })
                            }
                            disabled={isLoading}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="newFeatures">New Features</Label>
                            <p className="text-xs text-muted-foreground">
                              Updates about new features and improvements
                            </p>
                          </div>
                          <Switch
                            id="newFeatures"
                            checked={notificationSettings.newFeatures}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                newFeatures: checked,
                              })
                            }
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}