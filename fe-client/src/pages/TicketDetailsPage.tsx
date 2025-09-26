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

  useEffect(() => {
    if (ticketId) {
      loadTicketDetails();
    }
  }, [ticketId]);

  const loadTicketDetails = async () => {
    if (!ticketId) return;
    
    try {
      setLoading(true);
      setError(null);
      const ticketData = await ticketsService.getTicketDetails(ticketId);
      setTicket(ticketData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
          <p>Loading ticket details...</p>
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
          <p>The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
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
          ← Back to Dashboard
        </button>
        <h1>Ticket Details</h1>
      </div>

      <div className="ticket-content">
        <div className="ticket-main-info">
          <div className="info-section">
            <h3>Ticket Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Ticket ID:</span>
                <span className="info-value">{ticket.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value status-badge ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Price:</span>
                <span className="info-value price-value">{formatPrice(ticket.price)}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Event Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Event Name:</span>
                <span className="info-value">{ticket.eventName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{ticket.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Start Date:</span>
                <span className="info-value">{formatDate(ticket.eventStart)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">End Date:</span>
                <span className="info-value">{formatDate(ticket.eventEnd)}</span>
              </div>
            </div>
          </div>

          {ticket.description && (
            <div className="info-section">
              <h3>Description</h3>
              <p className="ticket-description">{ticket.description}</p>
            </div>
          )}
        </div>

        <div className="ticket-actions-section">
          <h3>Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn download-btn"
              onClick={handleDownloadQrCode}
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
