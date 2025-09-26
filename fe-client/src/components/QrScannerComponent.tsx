import React, { useState, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import './QrScannerComponent.css';

interface QrScannerComponentProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QrScannerComponent: React.FC<QrScannerComponentProps> = ({ onScan, onClose, isOpen }) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue || detectedCodes[0].data;
      if (result) {
        // Extract UUID from QR code result
        // QR codes might contain just the UUID or be formatted differently
        const uuid = extractUuidFromQrCode(result);
        if (uuid) {
          onScan(uuid);
          setIsScanning(false);
        } else {
          setError('Invalid QR code format. Please scan a valid ticket QR code.');
        }
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error);
    setError('Camera access denied or QR scanner error. Please check camera permissions.');
    setIsScanning(false);
  };

  const extractUuidFromQrCode = (qrData: string): string | null => {
    // Try to extract UUID from various possible QR code formats
    // UUID pattern: 8-4-4-4-12 hexadecimal characters
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = qrData.match(uuidPattern);
    
    if (match) {
      return match[0];
    }

    // If QR code contains just the UUID without any other text
    if (qrData.length === 36 && uuidPattern.test(qrData)) {
      return qrData;
    }

    // If QR code contains JSON with ticket ID
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.ticketId || parsed.id) {
        return parsed.ticketId || parsed.id;
      }
    } catch (e) {
      // Not JSON, continue with other checks
    }

    // If QR code contains URL with ticket ID parameter
    const urlMatch = qrData.match(/[?&]ticketId=([^&]+)/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    return null;
  };

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  if (!isOpen) return null;

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h2>Scan QR Code</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="qr-scanner-content">
          {!isScanning ? (
            <div className="scanner-placeholder">
              <div className="scanner-icon">📷</div>
              <h3>Ready to Scan</h3>
              <p>Click "Start Camera" to begin scanning QR codes</p>
              <button className="start-camera-btn" onClick={startScanning}>
                Start Camera
              </button>
            </div>
          ) : (
            <div className="scanner-container">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: 'environment' // Use back camera
                }}
              />
              <div className="scanner-overlay">
                <div className="scanner-frame">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="scanner-error">
              {error}
            </div>
          )}

          <div className="scanner-instructions">
            <h4>Instructions:</h4>
            <ul>
              <li>Position the QR code within the scanning frame</li>
              <li>Ensure good lighting for better scanning</li>
              <li>Hold the device steady while scanning</li>
              <li>The QR code should contain a valid ticket ID</li>
            </ul>
          </div>

          {isScanning && (
            <div className="scanner-controls">
              <button className="stop-camera-btn" onClick={stopScanning}>
                Stop Camera
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrScannerComponent;
