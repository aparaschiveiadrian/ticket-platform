import React, { useState } from 'react';
import { ticketValidationService } from '../services/ticketValidationService';
import { TicketValidationResponse } from '../types';
import QrScannerComponent from '../components/QrScannerComponent';
import './StaffLandingPage.css';

const StaffLandingPage: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [validationMethod, setValidationMethod] = useState<'MANUAL' | 'QR_SCAN'>('MANUAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValidation, setLastValidation] = useState<TicketValidationResponse | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  const handleValidation = async () => {
    if (validationMethod === 'QR_SCAN') {
      setIsQrScannerOpen(true);
      return;
    }

    if (!ticketId.trim()) {
      setError('Please enter a ticket ID');
      return;
    }

    await performValidation(ticketId.trim());
  };

  const performValidation = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ticketValidationService.validateTicket({
        id: id,
        method: validationMethod
      });
      setLastValidation(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQrScan = (scannedTicketId: string) => {
    setTicketId(scannedTicketId);
    setIsQrScannerOpen(false);
    performValidation(scannedTicketId);
  };

  const handleQrScannerClose = () => {
    setIsQrScannerOpen(false);
  };

  const handleClear = () => {
    setTicketId('');
    setError(null);
    setLastValidation(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALID': return 'status-valid';
      case 'INVALID': return 'status-invalid';
      case 'EXPIRED': return 'status-expired';
      default: return 'status-invalid';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALID': return '✅';
      case 'INVALID': return '❌';
      case 'EXPIRED': return '⏰';
      default: return '❌';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="staff-landing-container">
      <div className="staff-header">
        <h1>Staff Dashboard</h1>
        <p>Validate tickets for event entry</p>
      </div>

      <div className="validation-section">
        <div className="validation-card">
          <h2>Ticket Validation</h2>
          
          <div className="validation-form">
            <div className="form-group">
              <label htmlFor="ticketId">Ticket ID</label>
              <input
                type="text"
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Enter ticket ID to validate"
                className="ticket-id-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="validationMethod">Validation Method</label>
              <select
                id="validationMethod"
                value={validationMethod}
                onChange={(e) => setValidationMethod(e.target.value as 'MANUAL' | 'QR_SCAN')}
                className="method-select"
                disabled={loading}
              >
                <option value="MANUAL">Manual Validation</option>
                <option value="QR_SCAN">QR Code Scan</option>
              </select>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                className="validate-btn"
                onClick={handleValidation}
                disabled={loading || (validationMethod === 'MANUAL' && !ticketId.trim())}
              >
                {loading ? 'Validating...' : 
                 validationMethod === 'QR_SCAN' ? 'Scan QR Code' : 'Validate Ticket'}
              </button>
              <button
                className="clear-btn"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {lastValidation && (
          <div className="result-card">
            <h3>Validation Result</h3>
            <div className="result-content">
              <div className="result-status">
                <div className={`status-badge ${getStatusColor(lastValidation.status)}`}>
                  <span className="status-icon">{getStatusIcon(lastValidation.status)}</span>
                  <span className="status-text">{lastValidation.status}</span>
                </div>
              </div>
              
              <div className="result-details">
                <div className="detail-item">
                  <span className="detail-label">Ticket ID:</span>
                  <span className="detail-value">{lastValidation.ticketId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Method:</span>
                  <span className="detail-value">{validationMethod === 'MANUAL' ? 'Manual Validation' : 'QR Code Scan'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="instructions-section">
        <h3>Instructions</h3>
        <div className="instructions-grid">
          <div className="instruction-card">
            <div className="instruction-icon">📱</div>
            <h4>QR Code Scan</h4>
            <p>Use this method when scanning QR codes from attendee tickets. The system will automatically validate the ticket.</p>
          </div>
          <div className="instruction-card">
            <div className="instruction-icon">✋</div>
            <h4>Manual Validation</h4>
            <p>Use this method when manually entering ticket IDs or when QR scanning is not available.</p>
          </div>
        </div>
      </div>

      <QrScannerComponent
        isOpen={isQrScannerOpen}
        onScan={handleQrScan}
        onClose={handleQrScannerClose}
      />
    </div>
  );
};

export default StaffLandingPage;
