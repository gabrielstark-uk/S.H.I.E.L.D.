import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, MapPin, Mail, Phone, Shield } from 'lucide-react';

interface UKSettingsProps {
  settings: {
    enableAutomaticReporting: boolean;
    policeForceEmail: string;
    localPoliceStation: string;
  };
  onSave: (settings: {
    enableAutomaticReporting: boolean;
    policeForceEmail: string;
    localPoliceStation: string;
  }) => void;
}

// UK Police Forces
const UK_POLICE_FORCES = [
  { name: "Avon and Somerset Constabulary", email: "force.control@avonandsomerset.police.uk" },
  { name: "Bedfordshire Police", email: "force.control@bedfordshire.police.uk" },
  { name: "Cambridgeshire Constabulary", email: "force.control@cambs.police.uk" },
  { name: "Cheshire Constabulary", email: "force.control@cheshire.police.uk" },
  { name: "City of London Police", email: "force.control@cityoflondon.police.uk" },
  { name: "Cleveland Police", email: "force.control@cleveland.police.uk" },
  { name: "Cumbria Constabulary", email: "force.control@cumbria.police.uk" },
  { name: "Derbyshire Constabulary", email: "force.control@derbyshire.police.uk" },
  { name: "Devon & Cornwall Police", email: "force.control@devonandcornwall.police.uk" },
  { name: "Dorset Police", email: "force.control@dorset.police.uk" },
  { name: "Durham Constabulary", email: "force.control@durham.police.uk" },
  { name: "Essex Police", email: "force.control@essex.police.uk" },
  { name: "Gloucestershire Constabulary", email: "force.control@gloucestershire.police.uk" },
  { name: "Greater Manchester Police", email: "force.control@gmp.police.uk" },
  { name: "Hampshire Constabulary", email: "force.control@hampshire.police.uk" },
  { name: "Hertfordshire Constabulary", email: "force.control@herts.police.uk" },
  { name: "Humberside Police", email: "force.control@humberside.police.uk" },
  { name: "Kent Police", email: "force.control@kent.police.uk" },
  { name: "Lancashire Constabulary", email: "force.control@lancashire.police.uk" },
  { name: "Leicestershire Police", email: "force.control@leicestershire.police.uk" },
  { name: "Lincolnshire Police", email: "force.control@lincs.police.uk" },
  { name: "Merseyside Police", email: "force.control@merseyside.police.uk" },
  { name: "Metropolitan Police Service", email: "force.control@met.police.uk" },
  { name: "Norfolk Constabulary", email: "force.control@norfolk.police.uk" },
  { name: "North Yorkshire Police", email: "force.control@northyorkshire.police.uk" },
  { name: "Northamptonshire Police", email: "force.control@northants.police.uk" },
  { name: "Northumbria Police", email: "force.control@northumbria.police.uk" },
  { name: "Nottinghamshire Police", email: "force.control@nottinghamshire.police.uk" },
  { name: "Police Scotland", email: "force.control@scotland.police.uk" },
  { name: "Police Service of Northern Ireland", email: "force.control@psni.police.uk" },
  { name: "South Yorkshire Police", email: "force.control@southyorks.police.uk" },
  { name: "Staffordshire Police", email: "force.control@staffordshire.police.uk" },
  { name: "Suffolk Constabulary", email: "force.control@suffolk.police.uk" },
  { name: "Surrey Police", email: "force.control@surrey.police.uk" },
  { name: "Sussex Police", email: "force.control@sussex.police.uk" },
  { name: "Thames Valley Police", email: "force.control@thamesvalley.police.uk" },
  { name: "Warwickshire Police", email: "force.control@warwickshire.police.uk" },
  { name: "West Mercia Police", email: "force.control@westmercia.police.uk" },
  { name: "West Midlands Police", email: "force.control@westmidlands.police.uk" },
  { name: "West Yorkshire Police", email: "force.control@westyorkshire.police.uk" },
  { name: "Wiltshire Police", email: "force.control@wiltshire.police.uk" }
];

export function UKSettings({ settings, onSave }: UKSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedForce, setSelectedForce] = useState<string | null>(null);

  useEffect(() => {
    // Find the police force based on the email
    const force = UK_POLICE_FORCES.find(force => force.email === settings.policeForceEmail);
    if (force) {
      setSelectedForce(force.name);
    } else {
      setSelectedForce(null);
    }
  }, [settings]);

  const handleSave = () => {
    setError(null);
    setSuccess(null);
    
    try {
      onSave(localSettings);
      setSuccess('UK settings saved successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    }
  };

  const handlePoliceForceChange = (forceName: string) => {
    const force = UK_POLICE_FORCES.find(f => f.name === forceName);
    if (force) {
      setSelectedForce(forceName);
      setLocalSettings(prev => ({
        ...prev,
        policeForceEmail: force.email
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          UK-Specific Settings
        </CardTitle>
        <CardDescription>
          Configure settings specific to the United Kingdom
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableAutomaticReporting" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Automatic Police Reporting
            </Label>
            <Switch
              id="enableAutomaticReporting"
              checked={localSettings.enableAutomaticReporting}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, enableAutomaticReporting: checked }))
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled, detection reports will be automatically sent to your local police force
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="policeForce" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Local Police Force
          </Label>
          <Select
            value={selectedForce || ''}
            onValueChange={handlePoliceForceChange}
            disabled={!localSettings.enableAutomaticReporting}
          >
            <SelectTrigger id="policeForce">
              <SelectValue placeholder="Select your local police force" />
            </SelectTrigger>
            <SelectContent>
              {UK_POLICE_FORCES.map((force) => (
                <SelectItem key={force.name} value={force.name}>
                  {force.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Select the police force that covers your area
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="localPoliceStation" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Local Police Station
          </Label>
          <Input
            id="localPoliceStation"
            value={localSettings.localPoliceStation}
            onChange={(e) => 
              setLocalSettings(prev => ({ ...prev, localPoliceStation: e.target.value }))
            }
            placeholder="e.g., Brixton Police Station"
            disabled={!localSettings.enableAutomaticReporting}
          />
          <p className="text-sm text-muted-foreground">
            Enter the name of your nearest police station for more accurate reporting
          </p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
          <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Important Information
          </h4>
          <p className="text-sm text-amber-700">
            Automatic reporting should only be used for genuine incidents. False reports may constitute 
            wasting police time, which is an offence under Section 5(2) of the Criminal Law Act 1967.
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save UK Settings
        </Button>
      </CardFooter>
    </Card>
  );
}