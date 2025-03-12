import { useState, useEffect, useRef } from "react";

interface AudioAnalyzerResult {
  isRecording: boolean;
  frequencyData: Uint8Array | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  sampleRate: number | null;
  soundCannonDetected: boolean;
}

export function useAudioAnalyzer(): AudioAnalyzerResult {
  const [isRecording, setIsRecording] = useState(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [sampleRate, setSampleRate] = useState<number | null>(null);
  const [soundCannonDetected, setSoundCannonDetected] = useState(false);

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
          autoGainControl: false,
          sampleRate: 192000, // Higher sample rate for better detection
          channelCount: 1
        } 
      });

      audioContextRef.current = new AudioContext({
        sampleRate: 192000
      });
      setSampleRate(audioContextRef.current.sampleRate);

      analyzerRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Enhanced settings for sound cannon detection
      analyzerRef.current.fftSize = 8192;
      analyzerRef.current.smoothingTimeConstant = 0.1;
      analyzerRef.current.minDecibels = -100;
      analyzerRef.current.maxDecibels = -30;

      sourceRef.current.connect(analyzerRef.current);

      const updateFrequencyData = () => {
        if (!analyzerRef.current) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);

        // Detect sound cannon (high amplitude in 2-10kHz range)
        const binSize = (audioContextRef.current?.sampleRate || 192000) / analyzerRef.current.fftSize;
        const startBin = Math.floor(2000 / binSize);
        const endBin = Math.floor(10000 / binSize);

        const highIntensityCount = dataArray
          .slice(startBin, endBin)
          .filter(amplitude => amplitude > 200).length;

        setSoundCannonDetected(highIntensityCount > (endBin - startBin) * 0.3);
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
    setSoundCannonDetected(false);
  };

  return {
    isRecording,
    frequencyData,
    startRecording,
    stopRecording,
    sampleRate,
    soundCannonDetected
  };
}