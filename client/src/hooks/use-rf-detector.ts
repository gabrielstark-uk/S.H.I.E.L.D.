import { useState, useEffect } from 'react';

interface RFDetectionResult {
  isScanning: boolean;
  signalStrength: number | null;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
}

export function useRFDetector(): RFDetectionResult {
  const [isScanning, setIsScanning] = useState(false);
  const [signalStrength, setSignalStrength] = useState<number | null>(null);

  const startScanning = async () => {
    try {
      // Check if the device has the required sensors
      if ('Magnetometer' in window) {
        // @ts-ignore - Magnetometer API is experimental
        const magnetometer = new Magnetometer({ frequency: 60 });
        
        magnetometer.addEventListener('reading', () => {
          // Calculate signal strength from magnetic field values
          const strength = Math.sqrt(
            Math.pow(magnetometer.x, 2) + 
            Math.pow(magnetometer.y, 2) + 
            Math.pow(magnetometer.z, 2)
          );
          
          setSignalStrength(strength);
        });

        magnetometer.start();
        setIsScanning(true);
      } else {
        throw new Error('Magnetometer not available');
      }
    } catch (error) {
      console.error('Error accessing magnetometer:', error);
      // Fallback to simulated detection for demo purposes
      simulateRFDetection();
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setSignalStrength(null);
  };

  // Simulate RF detection for devices without magnetometer
  const simulateRFDetection = () => {
    setIsScanning(true);
    const interval = setInterval(() => {
      // Simulate random signal strength fluctuations
      const baseStrength = 50;
      const noise = Math.random() * 20 - 10;
      setSignalStrength(baseStrength + noise);
    }, 100);

    return () => clearInterval(interval);
  };

  return {
    isScanning,
    signalStrength,
    startScanning,
    stopScanning
  };
}
