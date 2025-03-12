import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRFDetector } from "@/hooks/use-rf-detector";
import { Search, SearchX } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function RFDetector() {
  const { isScanning, signalStrength, startScanning, stopScanning } = useRFDetector();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>RF Chip Scanner</span>
          <Button
            variant={isScanning ? "destructive" : "default"}
            onClick={isScanning ? stopScanning : startScanning}
          >
            {isScanning ? (
              <>
                <SearchX className="mr-2 h-4 w-4" />
                Stop Scanning
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Start Scanning
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isScanning && signalStrength !== null && (
          <div className="space-y-4">
            <Progress value={signalStrength} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Signal Strength: {Math.round(signalStrength)}%</span>
              {signalStrength > 70 && (
                <span className="text-destructive font-semibold">
                  High RF Activity Detected!
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Scanning for RF signals in the 125 kHz - 13.56 MHz range
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
