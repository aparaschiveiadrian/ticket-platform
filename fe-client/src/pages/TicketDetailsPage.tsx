import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketsService } from '../services/ticketsService';
import { GetTicketResponse } from '../types';
import './TicketDetailsPage.css';

const TicketDetailsPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<GetTicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (ticketId) {
      loadTicketDetails();
    }
    return () => {
      // Cleanup QR URL to avoid memory leaks
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [ticketId]);

  const loadTicketDetails = async () => {
    if (!ticketId) return;

    try {
      setLoading(true);
      setError(null);

      // Parallel fetch for details and QR code
      const [ticketData, qrBlob] = await Promise.all([
        ticketsService.getTicketDetails(ticketId),
        ticketsService.getTicketQrCode(ticketId)
      ]);

      setTicket(ticketData);

      if (qrBlob) {
        const url = URL.createObjectURL(qrBlob);
        setQrCodeUrl(url);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleDownloadQrCode = async () => {
    if (!ticketId) return;
    try {
      await ticketsService.downloadTicketQrCode(ticketId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download QR code');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PURCHASED': return 'status-purchased';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-purchased';
    }
  };

  if (loading) {
    return (
      <div className="ticket-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-details-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBackClick} className="back-button">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-container">
        <div className="error-message">
          <h2>Ticket Not Found</h2>
          <p>The ticket you were looking for could not be found.</p>
          <button onClick={handleBackClick} className="back-button">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-details-container">
      <div className="ticket-header">
        <button onClick={handleBackClick} className="back-button">
          ← Back
        </button>
        <h1>Ticket Details</h1>
      </div>

      <div className="ticket-content">
        <div className="ticket-main-info">

          {/* TOP SECTION: Event Info */}
          <div className="info-section">
            <div className={`status-badge ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </div>

            <div className="info-item">
              <span className="info-label">Event</span>
              <span className="info-value" style={{ fontSize: '2rem', lineHeight: '1.2' }}>{ticket.eventName}</span>
            </div>

            <div className="info-grid" style={{ marginTop: '32px' }}>
              <div className="info-item">
                <span className="info-label">Date & Time</span>
                <span className="info-value">
                  {formatDate(ticket.eventStart)} • {formatTime(ticket.eventStart)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{ticket.location}</span>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Actions & QR */}
          <div className="ticket-actions-section">
            <div className="qr-code-container" style={{ marginBottom: '40px', textAlign: 'center' }}>
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Ticket QR Code"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '16px',
                    display: 'block',
                    margin: '0 auto',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                  }}
                />
              ) : (
                <div style={{
                  width: '200px',
                  height: '200px',
                  background: '#F2F2F7',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: '#8E8E93'
                }}>
                  Generating QR...
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="action-btn download-btn"
                onClick={handleDownloadQrCode}
              >
                Save to Photos
              </button>
            </div>

            <div className="price-value" style={{ textAlign: 'center', marginTop: '32px' }}>
              {formatPrice(ticket.price)}
            </div>

            <div className="ticket-description">
              ID: {ticket.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
