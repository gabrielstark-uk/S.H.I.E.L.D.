import { useState } from 'react';

interface SpywareScanResult {
  type: 'microphone' | 'camera' | 'process' | 'network';
  status: 'suspicious' | 'clean';
  details: string;
}

export function useSpywareScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<SpywareScanResult[]>([]);

  const scanDevice = async () => {
    setIsScanning(true);
    const scanResults: SpywareScanResult[] = [];

    // Check for active media permissions
    try {
      const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (permissions.state === 'granted') {
        scanResults.push({
          type: 'microphone',
          status: 'suspicious',
          details: 'Microphone access is currently enabled'
        });
      }
    } catch (error) {
      console.error('Error checking microphone permissions:', error);
    }

    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissions.state === 'granted') {
        scanResults.push({
          type: 'camera',
          status: 'suspicious',
          details: 'Camera access is currently enabled'
        });
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
    }

    // Check for service workers (potential spyware vector)
    if (navigator.serviceWorker) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        scanResults.push({
          type: 'process',
          status: 'suspicious',
          details: `${registrations.length} active service workers detected`
        });
      }
    }

    // Network connection check
    if (navigator.connection) {
      const conn = navigator.connection as any;
      if (conn.type === 'cellular' || conn.saveData) {
        scanResults.push({
          type: 'network',
          status: 'suspicious',
          details: 'Unusual network configuration detected'
        });
      }
    }

    setResults(scanResults);
    setIsScanning(false);
  };

  return {
    isScanning,
    results,
    scanDevice
  };
}
