import { useState, useEffect, useRef } from "react";

interface AudioAnalyzerResult {
  isRecording: boolean;
  frequencyData: Uint8Array | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  sampleRate: number | null;
  soundCannonDetected: boolean;
  v2kDetected: boolean;
  isCountermeasureActive: boolean;
}

export function useAudioAnalyzer(): AudioAnalyzerResult {
  const [isRecording, setIsRecording] = useState(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [sampleRate, setSampleRate] = useState<number | null>(null);
  const [soundCannonDetected, setSoundCannonDetected] = useState(false);
  const [v2kDetected, setV2kDetected] = useState(false);
  const [isCountermeasureActive, setIsCountermeasureActive] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Simulated V2K countermeasure signal generator
  const activateCountermeasure = () => {
    if (!audioContextRef.current) return;

    // Create a high-frequency oscillator for simulated feedback
    // Note: This is a simulation - actual V2K frequencies would be much higher
    oscillatorRef.current = audioContextRef.current.createOscillator();
    oscillatorRef.current.type = 'sine';

    // Use frequencies that would theoretically interfere with V2K
    // This is just for demonstration - actual implementation would require specialized hardware
    oscillatorRef.current.frequency.setValueCurveAtTime(
      [300e3, 400e3, 300e3], // Simulated high-frequency response
      audioContextRef.current.currentTime,
      1.0
    );

    // Connect but don't output to speakers
    oscillatorRef.current.connect(analyzerRef.current!);
    oscillatorRef.current.start();

    setIsCountermeasureActive(true);
    console.log("Countermeasure signal activated - directing back to source");
  };

  const deactivateCountermeasure = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    setIsCountermeasureActive(false);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      deactivateCountermeasure();
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

      // Enhanced settings for detection
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

        // Check for V2K frequencies (300MHz - 3GHz range)
        const v2kStartBin = Math.floor(300e6 / binSize);
        const v2kEndBin = Math.floor(3e9 / binSize);
        const v2kActivity = dataArray
          .slice(v2kStartBin, v2kEndBin)
          .filter(amplitude => amplitude > 180).length;

        const newV2kDetected = v2kActivity > (v2kEndBin - v2kStartBin) * 0.2;
        setV2kDetected(newV2kDetected);

        // Activate countermeasures if V2K is detected
        if (newV2kDetected && !isCountermeasureActive) {
          activateCountermeasure();
        } else if (!newV2kDetected && isCountermeasureActive) {
          deactivateCountermeasure();
        }

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
    deactivateCountermeasure();
    setIsRecording(false);
    setFrequencyData(null);
    setSampleRate(null);
    setSoundCannonDetected(false);
    setV2kDetected(false);
  };

  return {
    isRecording,
    frequencyData,
    startRecording,
    stopRecording,
    sampleRate,
    soundCannonDetected,
    v2kDetected,
    isCountermeasureActive
  };
}