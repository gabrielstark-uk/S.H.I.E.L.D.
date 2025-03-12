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
            Frequency Range Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Voice-to-Skull (V2K) Range</AlertTitle>
            <AlertDescription>
              300MHz - 3GHz: Microwave frequencies associated with potential V2K transmission
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Age-Specific Speech Ranges</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Adult Speech: 100Hz - 3kHz</p>
              <p>Child Speech: 3kHz - 8kHz</p>
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Special Ranges</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Infrasonic: 20Hz - 100Hz</p>
              <p>Ultrasonic: 8kHz - 20kHz</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detection Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. Monitor for unusual frequency patterns</p>
          <p>2. Check age-specific frequency anomalies</p>
          <p>3. Watch for microwave frequency spikes</p>
          <p>4. Document any persistent signals</p>
        </CardContent>
      </Card>
    </div>
  );
}