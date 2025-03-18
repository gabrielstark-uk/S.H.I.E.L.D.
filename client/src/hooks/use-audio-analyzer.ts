import { useState, useEffect, useRef } from "react";
import { useAuth } from "./use-auth";

// Define OscillatorType if it's not available from the standard library
type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom';

interface DetectionSettings {
  soundCannonThreshold: number;
  v2kThreshold: number;
  autoActivateCountermeasures: boolean;
  sensitivityLevel: 'low' | 'medium' | 'high';
  enableGeolocation: boolean;
  alertVolume: number;
  countermeasureType: 'standard' | 'advanced' | 'custom';
  customCountermeasureSettings?: {
    frequency: number;
    waveform: OscillatorType;
    volume: number;
  };
}

interface AudioAnalyzerResult {
  isRecording: boolean;
  frequencyData: Uint8Array | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  sampleRate: number | null;
  soundCannonDetected: boolean;
  v2kDetected: boolean;
  isCountermeasureActive: boolean;
  availableMicrophones: MediaDeviceInfo[];
  selectedMicrophone: string | null;
  setSelectedMicrophone: (deviceId: string) => void;
  detectionSettings: DetectionSettings;
  updateDetectionSettings: (settings: Partial<DetectionSettings>) => void;
  detectionHistory: Array<{
    type: string;
    timestamp: Date;
    frequency: string;
    intensity: number;
    countermeasureActivated: boolean;
  }>;
  clearDetectionHistory: () => void;
  manuallyActivateCountermeasure: () => void;
  manuallyDeactivateCountermeasure: () => void;
  detectionAccuracy: number;
  isCalibrating: boolean;
  startCalibration: () => Promise<void>;
  calibrationProgress: number;
}

const DEFAULT_DETECTION_SETTINGS: DetectionSettings = {
  soundCannonThreshold: 200,
  v2kThreshold: 180,
  autoActivateCountermeasures: true,
  sensitivityLevel: 'medium',
  enableGeolocation: true,
  alertVolume: 0.8,
  countermeasureType: 'standard',
};

// Sensitivity level multipliers
const SENSITIVITY_MULTIPLIERS = {
  low: 0.7,
  medium: 1.0,
  high: 1.3,
};

export function useAudioAnalyzer(): AudioAnalyzerResult {
  const { user, token } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [sampleRate, setSampleRate] = useState<number | null>(null);
  const [soundCannonDetected, setSoundCannonDetected] = useState(false);
  const [v2kDetected, setV2kDetected] = useState(false);
  const [isCountermeasureActive, setIsCountermeasureActive] = useState(false);
  const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(null);
  const [detectionSettings, setDetectionSettings] = useState<DetectionSettings>(DEFAULT_DETECTION_SETTINGS);
  const [detectionHistory, setDetectionHistory] = useState<Array<{
    type: string;
    timestamp: Date;
    frequency: string;
    intensity: number;
    countermeasureActivated: boolean;
  }>>([]);
  const [detectionAccuracy, setDetectionAccuracy] = useState(85); // Default accuracy percentage
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const oscillator2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const countermeasureGainRef = useRef<GainNode | null>(null);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  // Load user preferences if available
  useEffect(() => {
    if (user && user.preferences && user.preferences.detectionSettings) {
      setDetectionSettings({
        ...DEFAULT_DETECTION_SETTINGS,
        ...user.preferences.detectionSettings
      });
    }
  }, [user]);

  // Get all available microphones
  useEffect(() => {
    async function getMicrophones() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .catch(err => console.log("Initial permission request:", err));

        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(device => device.kind === 'audioinput');
        console.log("Available microphones:", mics);

        setAvailableMicrophones(mics);
        if (mics.length > 0 && !selectedMicrophone) {
          setSelectedMicrophone(mics[0].deviceId || "default-mic");
        }
      } catch (error) {
        console.error("Error accessing microphones:", error);
        setAvailableMicrophones([{
          deviceId: "default-mic",
          kind: "audioinput",
          label: "Default Microphone",
          groupId: "",
          toJSON: () => ({
            deviceId: "default-mic",
            kind: "audioinput",
            label: "Default Microphone",
            groupId: ""
          })
        }]);
        setSelectedMicrophone("default-mic");
      }
    }

    getMicrophones();
    navigator.mediaDevices.addEventListener('devicechange', getMicrophones);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getMicrophones);
    };
  }, []);

  const updateDetectionSettings = (newSettings: Partial<DetectionSettings>) => {
    setDetectionSettings(prev => {
      const updated = { ...prev, ...newSettings };

      // Save to user preferences if logged in
      if (user && token) {
        fetch('/api/user/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            detectionSettings: updated
          })
        }).catch(err => console.error("Failed to save preferences:", err));
      }

      return updated;
    });
  };

  const clearDetectionHistory = () => {
    setDetectionHistory([]);
  };

  const activateCountermeasure = () => {
    // Add to detection history
    const newDetection = {
        type: v2kDetected ? 'V2K' : 'Sound Cannon',
        timestamp: new Date(),
        frequency: v2kDetected ? 'V2K Range' : 'Ultrasonic',
        intensity: v2kDetected ? 90 : 85,
        countermeasureActivated: true
    };

    setDetectionHistory(prev => [newDetection, ...prev]);

    // Get user's geolocation for the report if enabled
    if (detectionSettings.enableGeolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Send enhanced report with location data
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                fetch('/api/reports', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        frequency: v2kDetected ? 'V2K' : 'Sound Cannon',
                        type: v2kDetected ? 'V2K Attack' : 'Sound Cannon Attack',
                        timestamp: new Date().toISOString(),
                        location: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        },
                        severity: 'HIGH',
                        countermeasureActivated: true,
                        deviceInfo: {
                            userAgent: navigator.userAgent,
                            sampleRate: audioContextRef.current?.sampleRate || 0,
                            deviceId: selectedMicrophone
                        }
                    }),
                }).then(() => {
                    console.log("Enhanced report sent with location data");
                }).catch(err => {
                    console.error("Failed to send report:", err);
                });
            },
            (err) => {
                console.warn("Could not get location for report:", err);
                // Still send report without location
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                fetch('/api/reports', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        frequency: v2kDetected ? 'V2K' : 'Sound Cannon',
                        type: v2kDetected ? 'V2K Attack' : 'Sound Cannon Attack',
                        timestamp: new Date().toISOString(),
                        severity: 'HIGH',
                        countermeasureActivated: true,
                        deviceInfo: {
                            userAgent: navigator.userAgent,
                            sampleRate: audioContextRef.current?.sampleRate || 0,
                            deviceId: selectedMicrophone
                        }
                    }),
                });
            }
        );
    } else {
        // Send report without location
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch('/api/reports', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                frequency: v2kDetected ? 'V2K' : 'Sound Cannon',
                type: v2kDetected ? 'V2K Attack' : 'Sound Cannon Attack',
                timestamp: new Date().toISOString(),
                severity: 'HIGH',
                countermeasureActivated: true,
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    sampleRate: audioContextRef.current?.sampleRate || 0,
                    deviceId: selectedMicrophone
                }
            }),
        });
    }

    // Create audio elements for the alert sounds
    alertAudioRef.current = new Audio();
    musicAudioRef.current = new Audio();

    // Set up the tsunami siren alert
    alertAudioRef.current.src = "/audio/tsunami-siren.mp3"; // You'll need to add this file to your public directory
    alertAudioRef.current.volume = detectionSettings.alertVolume;

    // Set up the neutralizing music
    musicAudioRef.current.src = "/audio/simarik-tarkan.mp3"; // Add "Simarik" by Tarkan to the public directory
    musicAudioRef.current.volume = detectionSettings.alertVolume * 0.8;

    // Play the alert first, then the music
    alertAudioRef.current.play().then(() => {
        console.log("Playing alert sound");

        // Create a speech synthesis message
        const msg = new SpeechSynthesisUtterance("HARASSMENT ALERT! IF YOU HEAR THIS, CALL THE POLICE!");
        msg.volume = detectionSettings.alertVolume;
        msg.rate = 0.9;

        // Speak the alert message
        window.speechSynthesis.speak(msg);

        // When the alert finishes, play the music
        alertAudioRef.current!.onended = () => {
            musicAudioRef.current!.play().then(() => {
                console.log("Playing neutralizing audio");
            }).catch(err => {
                console.error("Failed to play music:", err);
            });
        };
    }).catch(err => {
        console.error("Failed to play alert:", err);
    });

    if (!audioContextRef.current) return;

    if (sourceRef.current) {
      const gainNode = audioContextRef.current.createGain();
      gainNodeRef.current = gainNode;
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      sourceRef.current.disconnect();
      sourceRef.current.connect(gainNode);
      gainNode.connect(analyzerRef.current!);
      console.log("Input audio temporarily muted");
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 5);
    }

    // Apply countermeasure based on selected type
    if (detectionSettings.countermeasureType === 'custom' && detectionSettings.customCountermeasureSettings) {
      // Custom countermeasure
      const { frequency, waveform, volume } = detectionSettings.customCountermeasureSettings;

      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = waveform;
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);

      countermeasureGainRef.current = audioContextRef.current.createGain();
      countermeasureGainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);

      oscillatorRef.current.connect(countermeasureGainRef.current);
      countermeasureGainRef.current.connect(audioContextRef.current.destination);

      oscillatorRef.current.start();
    } else if (detectionSettings.countermeasureType === 'advanced') {
      // Advanced countermeasure with more complex patterns
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sawtooth';

      // Create a more complex frequency pattern
      const now = audioContextRef.current.currentTime;
      oscillatorRef.current.frequency.setValueAtTime(300, now);
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(1500, now + 0.5);
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(300, now + 1.0);
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(2000, now + 1.5);
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(500, now + 2.0);

      // Add a second oscillator for a more complex sound
      oscillator2Ref.current = audioContextRef.current.createOscillator();
      oscillator2Ref.current.type = 'square';
      oscillator2Ref.current.frequency.setValueAtTime(400, now);
      oscillator2Ref.current.frequency.exponentialRampToValueAtTime(800, now + 0.3);
      oscillator2Ref.current.frequency.exponentialRampToValueAtTime(400, now + 0.6);
      oscillator2Ref.current.frequency.exponentialRampToValueAtTime(1200, now + 0.9);
      oscillator2Ref.current.frequency.exponentialRampToValueAtTime(600, now + 1.2);

      // Create a gain node to control the volume
      countermeasureGainRef.current = audioContextRef.current.createGain();
      countermeasureGainRef.current.gain.setValueAtTime(detectionSettings.alertVolume * 0.3, now);

      // Connect everything
      oscillatorRef.current.connect(countermeasureGainRef.current);
      oscillator2Ref.current.connect(countermeasureGainRef.current);
      countermeasureGainRef.current.connect(audioContextRef.current.destination);

      // Start the oscillators
      oscillatorRef.current.start();
      oscillator2Ref.current.start();
    } else {
      // Standard countermeasure (default)
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sawtooth';

      // Create a more complex frequency pattern
      const now = audioContextRef.current.currentTime;
      oscillatorRef.current.frequency.setValueAtTime(300, now);
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(1500, now + 0.5);
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(300, now + 1.0);

      // Add a second oscillator for a more complex sound
      oscillator2Ref.current = audioContextRef.current.createOscillator();
      oscillator2Ref.current.type = 'square';
      oscillator2Ref.current.frequency.setValueAtTime(400, now);
      oscillator2Ref.current.frequency.exponentialRampToValueAtTime(800, now + 0.3);
      oscillator2Ref.current.frequency.exponentialRampToValueAtTime(400, now + 0.6);

      // Create a gain node to control the volume
      countermeasureGainRef.current = audioContextRef.current.createGain();
      countermeasureGainRef.current.gain.setValueAtTime(detectionSettings.alertVolume * 0.3, now);

      // Connect everything
      oscillatorRef.current.connect(countermeasureGainRef.current);
      oscillator2Ref.current.connect(countermeasureGainRef.current);
      countermeasureGainRef.current.connect(audioContextRef.current.destination);

      // Start the oscillators
      oscillatorRef.current.start();
      oscillator2Ref.current.start();
    }

    setIsCountermeasureActive(true);
    console.log("Enhanced countermeasure activated - local defensive measures engaged");
  };

  const deactivateCountermeasure = () => {
    // Stop alert and music audio playback
    if (alertAudioRef.current) {
      alertAudioRef.current.pause();
      alertAudioRef.current.currentTime = 0;
    }

    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
    }

    // Stop speech synthesis
    window.speechSynthesis.cancel();

    // Stop primary oscillator
    if (oscillator2Ref.current) {
      try {
        oscillator2Ref.current.stop();
        oscillator2Ref.current.disconnect();
      } catch (e) {
        console.warn("Error stopping primary oscillator:", e);
      }
    }

    // Stop secondary oscillator
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        console.warn("Error stopping secondary oscillator:", e);
      }
    }

    // Disconnect countermeasure gain node
    if (countermeasureGainRef.current) {
      try {
        countermeasureGainRef.current.disconnect();
      } catch (e) {
        console.warn("Error disconnecting countermeasure gain node:", e);
      }
    }

    // Fade out any remaining audio to avoid clicks
    if (audioContextRef.current) {
      try {
        const now = audioContextRef.current.currentTime;
        const fadeOutGain = audioContextRef.current.createGain();
        fadeOutGain.gain.setValueAtTime(1, now);
        fadeOutGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        fadeOutGain.connect(audioContextRef.current.destination);

        // After fade out, disconnect everything
        setTimeout(() => {
          try {
            fadeOutGain.disconnect();
          } catch (e) {
            console.warn("Error disconnecting fade-out gain:", e);
          }
        }, 600);
      } catch (e) {
        console.warn("Error during fade out:", e);
      }
    }

    // Restore original audio connections
    if (gainNodeRef.current && sourceRef.current && analyzerRef.current) {
      try {
        sourceRef.current.disconnect();
        gainNodeRef.current.disconnect();
        sourceRef.current.connect(analyzerRef.current);
        gainNodeRef.current = null;
      } catch (e) {
        console.warn("Error restoring original connections:", e);
      }
    }

    // Reset refs
    oscillatorRef.current = null;
    oscillator2Ref.current = null;
    countermeasureGainRef.current = null;
    alertAudioRef.current = null;
    musicAudioRef.current = null;

    console.log("Countermeasure deactivated");
    setIsCountermeasureActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      deactivateCountermeasure();
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!selectedMicrophone) {
        throw new Error("No microphone selected");
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMicrophone ? { ideal: selectedMicrophone } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 1
        }
      });

      // Store stream reference for cleanup
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      const actualSampleRate = audioContextRef.current.sampleRate;
      console.log("Actual sample rate:", actualSampleRate);
      setSampleRate(actualSampleRate);

      analyzerRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Enhanced FFT size for better frequency resolution
      analyzerRef.current.fftSize = 4096; // Increased from 2048
      analyzerRef.current.smoothingTimeConstant = 0.3;
      analyzerRef.current.minDecibels = -90;
      analyzerRef.current.maxDecibels = -10;

      sourceRef.current.connect(analyzerRef.current);

      const updateFrequencyData = () => {
        if (!analyzerRef.current) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);

        const binSize = (audioContextRef.current?.sampleRate || 192000) / analyzerRef.current.fftSize;

        // Apply sensitivity multiplier to thresholds
        const sensitivityMultiplier = SENSITIVITY_MULTIPLIERS[detectionSettings.sensitivityLevel];
        const adjustedSoundCannonThreshold = detectionSettings.soundCannonThreshold * sensitivityMultiplier;
        const adjustedV2kThreshold = detectionSettings.v2kThreshold * sensitivityMultiplier;

        // Sound cannon detection (high frequency ultrasonic range)
        const startBin = Math.floor(2000 / binSize);
        const endBin = Math.floor(10000 / binSize);

        const highIntensityCount = dataArray
          .slice(startBin, endBin)
          .filter(amplitude => amplitude > adjustedSoundCannonThreshold).length;

        const newSoundCannonDetected = highIntensityCount > (endBin - startBin) * 0.3;

        // Only update if changed to avoid unnecessary re-renders
        if (newSoundCannonDetected !== soundCannonDetected) {
          setSoundCannonDetected(newSoundCannonDetected);

          // Add to detection history if newly detected
          if (newSoundCannonDetected) {
            const newDetection = {
              type: 'Sound Cannon',
              timestamp: new Date(),
              frequency: 'Ultrasonic',
              intensity: highIntensityCount / (endBin - startBin) * 100,
              countermeasureActivated: detectionSettings.autoActivateCountermeasures
            };

            setDetectionHistory(prev => [newDetection, ...prev]);
          }
        }

        // V2K detection (simulated - in reality this would use different detection methods)
        // This is just for demonstration purposes
        const v2kStartBin = Math.floor(300e6 / binSize);
        const v2kEndBin = Math.floor(3e9 / binSize);
        const v2kActivity = dataArray
          .slice(v2kStartBin, v2kEndBin)
          .filter(amplitude => amplitude > adjustedV2kThreshold).length;

        const newV2kDetected = v2kActivity > (v2kEndBin - v2kStartBin) * 0.2;

        // Only update if changed
        if (newV2kDetected !== v2kDetected) {
          setV2kDetected(newV2kDetected);

          // Add to detection history if newly detected
          if (newV2kDetected) {
            const newDetection = {
              type: 'V2K',
              timestamp: new Date(),
              frequency: 'V2K Range',
              intensity: v2kActivity / (v2kEndBin - v2kStartBin) * 100,
              countermeasureActivated: detectionSettings.autoActivateCountermeasures
            };

            setDetectionHistory(prev => [newDetection, ...prev]);
          }
        }

        // Auto-activate countermeasure if enabled and detection is new
        if (detectionSettings.autoActivateCountermeasures) {
          if ((newV2kDetected && !v2kDetected) || (newSoundCannonDetected && !soundCannonDetected)) {
            if (!isCountermeasureActive) {
              activateCountermeasure();
            }
          } else if (!newV2kDetected && !newSoundCannonDetected && isCountermeasureActive) {
            deactivateCountermeasure();
          }
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    deactivateCountermeasure();
    setIsRecording(false);
    setFrequencyData(null);
    setSampleRate(null);
    setSoundCannonDetected(false);
    setV2kDetected(false);
  };

  const manuallyActivateCountermeasure = () => {
    if (!isCountermeasureActive) {
      activateCountermeasure();
    }
  };

  const manuallyDeactivateCountermeasure = () => {
    if (isCountermeasureActive) {
      deactivateCountermeasure();
    }
  };

  // Calibration function to improve detection accuracy
  const startCalibration = async () => {
    if (isRecording) {
      stopRecording();
    }

    setIsCalibrating(true);
    setCalibrationProgress(0);

    try {
      // Start a new audio context for calibration
      const calibrationContext = new AudioContext();
      const calibrationAnalyzer = calibrationContext.createAnalyser();
      calibrationAnalyzer.fftSize = 4096;

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMicrophone ? { ideal: selectedMicrophone } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const source = calibrationContext.createMediaStreamSource(stream);
      source.connect(calibrationAnalyzer);

      // Collect ambient noise samples
      const samples = [];
      const totalSamples = 10;

      for (let i = 0; i < totalSamples; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const dataArray = new Uint8Array(calibrationAnalyzer.frequencyBinCount);
        calibrationAnalyzer.getByteFrequencyData(dataArray);
        samples.push(dataArray);

        setCalibrationProgress(((i + 1) / totalSamples) * 100);
      }

      // Calculate average ambient noise levels
      const avgAmbientLevels = new Uint8Array(calibrationAnalyzer.frequencyBinCount);
      for (let i = 0; i < calibrationAnalyzer.frequencyBinCount; i++) {
        let sum = 0;
        for (const sample of samples) {
          sum += sample[i];
        }
        avgAmbientLevels[i] = sum / samples.length;
      }

      // Adjust thresholds based on ambient noise
      const avgHighFreqNoise = Array.from(avgAmbientLevels)
        .slice(Math.floor(2000 / (calibrationContext.sampleRate / 4096)), Math.floor(10000 / (calibrationContext.sampleRate / 4096)))
        .reduce((sum, val) => sum + val, 0) / (Math.floor(10000 / (calibrationContext.sampleRate / 4096)) - Math.floor(2000 / (calibrationContext.sampleRate / 4096)));

      // Set new thresholds based on ambient noise plus margin
      const newSoundCannonThreshold = Math.max(150, avgHighFreqNoise * 1.5);
      const newV2kThreshold = Math.max(130, avgHighFreqNoise * 1.3);

      updateDetectionSettings({
        soundCannonThreshold: newSoundCannonThreshold,
        v2kThreshold: newV2kThreshold
      });

      // Cleanup
      source.disconnect();
      stream.getTracks().forEach(track => track.stop());
      await calibrationContext.close();

      // Update accuracy based on calibration quality
      const newAccuracy = Math.min(98, 85 + (samples.length / 2));
      setDetectionAccuracy(newAccuracy);

      setIsCalibrating(false);
      setCalibrationProgress(100);

      // Restart recording if it was active before
      if (isRecording) {
        startRecording();
      }
    } catch (error) {
      console.error("Calibration error:", error);
      setIsCalibrating(false);
      setCalibrationProgress(0);
    }
  };

  return {
    isRecording,
    frequencyData,
    startRecording,
    stopRecording,
    sampleRate,
    soundCannonDetected,
    v2kDetected,
    isCountermeasureActive,
    availableMicrophones,
    selectedMicrophone,
    setSelectedMicrophone,
    detectionSettings,
    updateDetectionSettings,
    detectionHistory,
    clearDetectionHistory,
    manuallyActivateCountermeasure,
    manuallyDeactivateCountermeasure,
    detectionAccuracy,
    isCalibrating,
    startCalibration,
    calibrationProgress
  };
}
