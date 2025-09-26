import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService } from '../services/eventsService';
import { EventDetails as EventDetailsType } from '../services/eventsService';
import { GetPublishedEventDetailsResponse, TicketType, GetPublishedEventDetailsTicketTypeResponse } from '../types';
import './EventDetailsPage.css';

type EventData = EventDetailsType | GetPublishedEventDetailsResponse;

// Type guards
const isEventDetails = (event: EventData): event is EventDetailsType => {
  return 'status' in event && 'organizerId' in event && 'createdAt' in event;
};

const isPublishedEventDetails = (event: EventData): event is GetPublishedEventDetailsResponse => {
  return 'totalAvailable' in event && !('status' in event);
};

// Ticket type type guards - now both types have totalAvailable
const isTicketType = (ticketType: TicketType | GetPublishedEventDetailsTicketTypeResponse): ticketType is TicketType => {
  return 'eventId' in ticketType && 'createdAt' in ticketType;
};

const isPublishedTicketType = (ticketType: TicketType | GetPublishedEventDetailsTicketTypeResponse): ticketType is GetPublishedEventDetailsTicketTypeResponse => {
  return !('eventId' in ticketType);
};

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = useCallback(async () => {
    if (!eventId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to get as owner first, fallback to public view
      let eventData: EventData;
      try {
        eventData = await eventsService.getEventDetails(eventId);
        setIsOwner(true);
      } catch (err) {
        // If not owner or event not found, try public view
        eventData = await eventsService.getPublishedEventDetails(eventId);
        setIsOwner(false);
      }
      
      setEvent(eventData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleDeleteEvent = async () => {
    if (!event || !isOwner) return;
    
    if (!window.confirm(`Are you sure you want to delete "${event.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await eventsService.deleteEvent(event.id);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleDeleteTicketType = async (ticketTypeId: string, ticketTypeName: string) => {
    if (!event || !isOwner) return;
    
    if (!window.confirm(`Are you sure you want to delete "${ticketTypeName}" ticket type? This action cannot be undone.`)) {
      return;
    }

    try {
      await eventsService.deleteTicketType(event.id, ticketTypeId);
      // Reload event details to reflect changes
      loadEventDetails();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete ticket type');
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
      currency: 'EUR'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'status-published';
      case 'DRAFT': return 'status-draft';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return 'status-draft';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return '✅';
      case 'DRAFT': return '📝';
      case 'CANCELLED': return '❌';
      case 'COMPLETED': return '🏁';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="event-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Event Not Found</h3>
          <p>{error || 'The event you are looking for does not exist or you do not have permission to view it.'}</p>
          <button onClick={() => navigate('/events')} className="back-to-events-btn">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <button onClick={() => navigate('/events')} className="back-button">
          ← Back to Events
        </button>
        
        <div className="event-header-content">
          <div className="event-title-section">
            <h1>{event.name}</h1>
            {isEventDetails(event) && (
              <div className={`event-status ${getStatusColor(event.status)}`}>
                <span className="status-icon">{getStatusIcon(event.status)}</span>
                {event.status}
              </div>
            )}
            {isPublishedEventDetails(event) && (
              <div className="event-status status-published">
                <span className="status-icon">✅</span>
                PUBLISHED
              </div>
            )}
          </div>
          
          {isOwner && (
            <div className="event-actions">
              <button 
                className="action-btn edit-btn"
                onClick={() => navigate(`/events/${event.id}/edit`)}
              >
                Edit Event
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={handleDeleteEvent}
              >
                Delete Event
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="event-details-content">
        <div className="event-main-info">
          <div className="info-card">
            <h3>Event Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{event.location}</span>
              </div>
              {event.start && (
                <div className="info-item">
                  <span className="info-label">Start Date</span>
                  <span className="info-value">{formatDate(event.start)}</span>
                </div>
              )}
              {event.end && (
                <div className="info-item">
                  <span className="info-label">End Date</span>
                  <span className="info-value">{formatDate(event.end)}</span>
                </div>
              )}
              {isEventDetails(event) && event.salesStart && (
                <div className="info-item">
                  <span className="info-label">Sales Start</span>
                  <span className="info-value">{formatDate(event.salesStart)}</span>
                </div>
              )}
              {isEventDetails(event) && event.salesEnd && (
                <div className="info-item">
                  <span className="info-label">Sales End</span>
                  <span className="info-value">{formatDate(event.salesEnd)}</span>
                </div>
              )}
              {isPublishedEventDetails(event) && (
                <div className="info-item">
                  <span className="info-label">Total Available</span>
                  <span className="info-value">{event.totalAvailable} tickets</span>
                </div>
              )}
              {isEventDetails(event) && (
                <>
                  <div className="info-item">
                    <span className="info-label">Created</span>
                    <span className="info-value">{formatDate(event.createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">{formatDate(event.updatedAt)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {event.description && (
            <div className="info-card">
              <h3>Description</h3>
              <p className="event-description">{event.description}</p>
            </div>
          )}
        </div>

        <div className="ticket-types-section">
          <h2>Ticket Types</h2>
          {event.ticketTypes.length === 0 ? (
            <div className="empty-ticket-types">
              <div className="empty-icon">🎫</div>
              <h3>No Ticket Types</h3>
              <p>This event doesn't have any ticket types configured yet.</p>
              {isOwner && (
                <button 
                  className="add-ticket-type-btn"
                  onClick={() => navigate(`/events/${event.id}/ticket-types/create`)}
                >
                  Add Ticket Type
                </button>
              )}
            </div>
          ) : (
            <div className="ticket-types-grid">
              {event.ticketTypes.map((ticketType) => (
                <div key={ticketType.id} className="ticket-type-card">
                  <div className="ticket-type-header">
                    <h4>{ticketType.name}</h4>
                    <div className="ticket-price">{formatPrice(ticketType.price)}</div>
                  </div>
                  
                  {ticketType.description && (
                    <p className="ticket-description">{ticketType.description}</p>
                  )}
                  
                  <div className="ticket-stats">
                    <div className="stat-item">
                      <span className="stat-label">Available:</span>
                      <span className="stat-value">{ticketType.totalAvailable}</span>
                    </div>
                    {isEventDetails(event) && isTicketType(ticketType) && (
                      <div className="stat-item">
                        <span className="stat-label">Sold:</span>
                        <span className="stat-value">
                          {ticketType.totalAvailable - (ticketType.totalAvailable - 0)} {/* This would need actual sold count from backend */}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {isOwner && (
                    <div className="ticket-actions">
                      <button 
                        className="ticket-action-btn edit-btn"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                      >
                        Edit Event
                      </button>
                      <button 
                        className="ticket-action-btn delete-btn"
                        onClick={() => handleDeleteTicketType(ticketType.id, ticketType.name)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
