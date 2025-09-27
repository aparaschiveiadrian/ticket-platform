import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService } from '../services/eventsService';
import { sseService } from '../services/sseService';
import { GetPublishedEventDetailsResponse } from '../types';
import PurchaseModal from '../components/PurchaseModal';
import './PublishedEventDetailsPage.css';

const PublishedEventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<GetPublishedEventDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realTimeQuantities, setRealTimeQuantities] = useState<Map<string, number>>(new Map());
  const [sseConnected, setSseConnected] = useState(false);
  const [sseReady, setSseReady] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState<{
    isOpen: boolean;
    ticketTypeId: string;
    ticketTypeName: string;
    ticketPrice: number;
    maxAvailable: number;
  }>({
    isOpen: false,
    ticketTypeId: '',
    ticketTypeName: '',
    ticketPrice: 0,
    maxAvailable: 0
  });

  const handleTicketUpdate = useCallback((ticketTypeId: string, newQuantity: number) => {
    setRealTimeQuantities(prev => {
      const newMap = new Map(prev);
      newMap.set(ticketTypeId, newQuantity);
      return newMap;
    });
  }, []);

  const getCurrentQuantity = useCallback((ticketTypeId: string, originalQuantity: number): number => {
    return realTimeQuantities.get(ticketTypeId) ?? originalQuantity;
  }, [realTimeQuantities]);

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
      
      // Connect to SSE with better state management
      const connectToSSE = async () => {
        try {
          sseService.connect(eventId, handleTicketUpdate, () => {
            setSseConnected(true);
            setSseReady(true);
            console.log('SSE is ready for real-time updates');
          });
          
          // Wait for connection to be established
          await sseService.waitForConnection();
          
        } catch (error) {
          console.error('Failed to connect to SSE:', error);
          setSseConnected(false);
          setSseReady(false);
        }
      };
      
      connectToSSE();
      
      // Periodic connection state check
      const connectionCheckInterval = setInterval(() => {
        setSseConnected(sseService.isConnected());
      }, 5000);
      
      return () => {
        clearInterval(connectionCheckInterval);
        sseService.disconnect();
        setSseConnected(false);
        setSseReady(false);
      };
    }
  }, [eventId, handleTicketUpdate]);

  const loadEventDetails = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventsService.getPublishedEventDetails(eventId);
      setEvent(eventData);
      
      const initialQuantities = new Map(
        eventData.ticketTypes.map(tt => [tt.id, tt.totalAvailable])
      );
      setRealTimeQuantities(initialQuantities);
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

  const handlePurchaseTicket = (ticketTypeId: string, ticketTypeName: string, ticketPrice: number, maxAvailable: number) => {
    setPurchaseModal({
      isOpen: true,
      ticketTypeId,
      ticketTypeName,
      ticketPrice,
      maxAvailable
    });
  };

  const handleClosePurchaseModal = () => {
    setPurchaseModal(prev => ({ ...prev, isOpen: false }));
  };

  const handlePurchaseSuccess = () => {
    handleClosePurchaseModal();
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
    <>
      <div className="published-event-details-container">
        <div className="connection-status">
          {sseReady ? (
            <span className="status-connected">🟢 Live updates active</span>
          ) : sseConnected ? (
            <span className="status-connecting">🟡 Setting up live updates...</span>
          ) : (
            <span className="status-disconnected">🔴 Connecting to live updates...</span>
          )}
        </div>
        
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
                  {event.ticketTypes.map((ticketType) => {
                    const currentQuantity = getCurrentQuantity(ticketType.id, ticketType.totalAvailable);
                    
                    return (
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
                        
                        <div className="ticket-availability">
                          <span className="availability-label">Available:</span>
                          <span className="availability-count">{currentQuantity} tickets</span>
                        </div>
                        
                        <button 
                          className="purchase-btn"
                          disabled={currentQuantity === 0 || !sseReady}
                          onClick={() => handlePurchaseTicket(ticketType.id, ticketType.name, ticketType.price, currentQuantity)}
                          title={!sseReady ? "Setting up real-time updates..." : currentQuantity === 0 ? "Sold out" : "Purchase tickets"}
                        >
                          {currentQuantity === 0 ? 'Sold Out' : 'Purchase Ticket'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={purchaseModal.isOpen}
        onClose={handleClosePurchaseModal}
        eventId={eventId || ''}
        ticketTypeId={purchaseModal.ticketTypeId}
        ticketTypeName={purchaseModal.ticketTypeName}
        ticketPrice={purchaseModal.ticketPrice}
        maxAvailable={purchaseModal.maxAvailable}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </>
  );
};

export default PublishedEventDetailsPage;
