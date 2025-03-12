import { useState, useEffect, useRef } from "react";

interface AudioAnalyzerResult {
  isRecording: boolean;
  frequencyData: Uint8Array | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  sampleRate: number | null;
}

export function useAudioAnalyzer(): AudioAnalyzerResult {
  const [isRecording, setIsRecording] = useState(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [sampleRate, setSampleRate] = useState<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });

      audioContextRef.current = new AudioContext();
      setSampleRate(audioContextRef.current.sampleRate);

      analyzerRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Optimize for sonic wave detection
      analyzerRef.current.fftSize = 4096; // Higher resolution for better frequency detection
      analyzerRef.current.smoothingTimeConstant = 0.2; // Lower smoothing for faster response

      sourceRef.current.connect(analyzerRef.current);

      const updateFrequencyData = () => {
        if (!analyzerRef.current) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);

        // Focus on sonic wave frequencies (20Hz - 20kHz)
        setFrequencyData(dataArray);

        animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
      };

      updateFrequencyData();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setFrequencyData(null);
    setSampleRate(null);
  };

  return {
    isRecording,
    frequencyData,
    startRecording,
    stopRecording,
    sampleRate
  };
}