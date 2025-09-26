import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService } from '../services/eventsService';
import { GetPublishedEventDetailsResponse } from '../types';
import './PublishedEventDetailsPage.css';

const PublishedEventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<GetPublishedEventDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventsService.getPublishedEventDetails(eventId);
      setEvent(eventData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event details');
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

  const handlePurchaseTicket = (ticketTypeId: string) => {
    // TODO: Implement ticket purchase functionality
    console.log('Purchase ticket type:', ticketTypeId);
  };

  if (loading) {
    return (
      <div className="published-event-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="published-event-details-container">
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

  if (!event) {
    return (
      <div className="published-event-details-container">
        <div className="error-message">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or is no longer available.</p>
          <button onClick={handleBackClick} className="back-button">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="published-event-details-container">
      <div className="event-header">
        <button onClick={handleBackClick} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>{event.name}</h1>
      </div>

      <div className="event-content">
        <div className="event-info">
          <div className="event-main-info">
            <div className="info-section">
              <h3>Event Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{event.location}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Start:</span>
                  <span className="info-value">{formatDate(event.start)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">End:</span>
                  <span className="info-value">{formatDate(event.end)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Available:</span>
                  <span className="info-value">{event.totalAvailable} tickets</span>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="info-section">
                <h3>Description</h3>
                <p className="event-description">{event.description}</p>
              </div>
            )}
          </div>

          <div className="ticket-types-section">
            <h3>Available Ticket Types</h3>
            {event.ticketTypes.length === 0 ? (
              <div className="empty-state">
                <p>No ticket types available for this event.</p>
              </div>
            ) : (
              <div className="ticket-types-grid">
                {event.ticketTypes.map((ticketType) => (
                  <div key={ticketType.id} className="ticket-type-card">
                    <div className="ticket-type-header">
                      <h4 className="ticket-type-name">{ticketType.name}</h4>
                      <div className="ticket-type-price">
                        {formatPrice(ticketType.price)}
                      </div>
                    </div>
                    
                    {ticketType.description && (
                      <p className="ticket-type-description">{ticketType.description}</p>
                    )}
                    
                    <button 
                      className="purchase-btn"
                      onClick={() => handlePurchaseTicket(ticketType.id)}
                    >
                      Purchase Ticket
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishedEventDetailsPage;
