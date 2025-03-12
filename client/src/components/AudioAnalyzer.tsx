import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudioAnalyzer } from "@/hooks/use-audio-analyzer";
import { FrequencyDisplay } from "./FrequencyDisplay";
import { Mic, MicOff } from "lucide-react";

export function AudioAnalyzer() {
  const { isRecording, frequencyData, startRecording, stopRecording } = useAudioAnalyzer();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Audio Frequency Analyzer</span>
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
      <CardContent>
        <FrequencyDisplay data={frequencyData} />
      </CardContent>
    </Card>
  );
}
