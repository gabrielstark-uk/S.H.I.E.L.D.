import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, Info } from "lucide-react";

export function SpywareInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Common Spyware Frequency Ranges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>High Frequency (18kHz - 24kHz)</AlertTitle>
            <AlertDescription>
              Often used by covert recording devices and ultrasonic beacons
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Mid Frequency (8kHz - 12kHz)</AlertTitle>
            <AlertDescription>
              Common range for hidden microphones and voice recorders
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. Regularly scan for unusual frequencies</p>
          <p>2. Be aware of your surroundings</p>
          <p>3. Keep your devices updated</p>
          <p>4. Use physical privacy measures (covers, blockers)</p>
        </CardContent>
      </Card>
    </div>
  );
}
