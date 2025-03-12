import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudioAnalyzer } from "@/hooks/use-audio-analyzer";
import { FrequencyDisplay } from "./FrequencyDisplay";
import { Mic, MicOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

export function AudioAnalyzer() {
  const { 
    isRecording, 
    frequencyData, 
    sampleRate, 
    soundCannonDetected, 
    v2kDetected,
    isCountermeasureActive,
    startRecording, 
    stopRecording 
  } = useAudioAnalyzer();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Frequency Protection System</span>
          <Button
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {soundCannonDetected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning: Sound Cannon Detected!</AlertTitle>
            <AlertDescription>
              High-intensity sonic frequencies detected in the 2-10kHz range.
              Consider moving to a safer location.
            </AlertDescription>
          </Alert>
        )}

        {v2kDetected && (
          <Alert variant={isCountermeasureActive ? "default" : "destructive"}>
            <Shield className="h-4 w-4" />
            <AlertTitle>
              V2K Attack Detected! {isCountermeasureActive && "- Countermeasures Active"}
            </AlertTitle>
            <AlertDescription>
              {isCountermeasureActive ? 
                "Defensive siren activated. Authorities should be contacted." :
                "Suspicious activity detected in V2K frequency range (300MHz-3GHz)."
              }
            </AlertDescription>
          </Alert>
        )}

        <FrequencyDisplay data={frequencyData} sampleRate={sampleRate} />
        {isRecording && (
          <p className="text-sm text-muted-foreground mt-4">
            Monitoring for dangerous frequencies and V2K attacks
          </p>
        )}
      </CardContent>
    </Card>
  );
}