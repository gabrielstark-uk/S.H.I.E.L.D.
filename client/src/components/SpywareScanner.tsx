import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpywareScanner } from "@/hooks/use-spyware-scanner";
import { Loader2, Shield, Camera, Mic, Network, CircuitBoard } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function SpywareScanner() {
  const { isScanning, results, scanDevice } = useSpywareScanner();

  const getIcon = (type: string) => {
    switch (type) {
      case 'camera':
        return <Camera className="h-4 w-4" />;
      case 'microphone':
        return <Mic className="h-4 w-4" />;
      case 'network':
        return <Network className="h-4 w-4" />;
      case 'process':
        return <CircuitBoard className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Device Spyware Scanner</span>
          <Button
            onClick={scanDevice}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Scan Device
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.length > 0 ? (
          results.map((result, index) => (
            <Alert
              key={index}
              variant={result.status === 'suspicious' ? 'destructive' : 'default'}
            >
              {getIcon(result.type)}
              <AlertTitle className="capitalize">{result.type} Access</AlertTitle>
              <AlertDescription>{result.details}</AlertDescription>
            </Alert>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Scan Device" to check for potential spyware and unauthorized access
          </p>
        )}
      </CardContent>
    </Card>
  );
}
