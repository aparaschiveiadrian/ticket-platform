import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsService } from '../services/eventsService';
import { ticketsService } from '../services/ticketsService';
import { Event, ListTicketResponse, PageResponse } from '../types';
import { tokenService } from '../services/tokenService';
import './AttendeeLandingPage.css';

const AttendeeLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tickets' | 'discover'>('tickets');
  const [myTickets, setMyTickets] = useState<ListTicketResponse[]>([]);
  const [publishedEvents, setPublishedEvents] = useState<Event[]>([]);
  const [ticketsPage, setTicketsPage] = useState(0);
  const [eventsPage, setEventsPage] = useState(0);
  const [ticketsHasMore, setTicketsHasMore] = useState(true);
  const [eventsHasMore, setEventsHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userInfo = tokenService.getUserInfo();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [ticketsData, eventsData] = await Promise.all([
        ticketsService.getMyTickets({ page: 0, size: 10 }),
        eventsService.getPublishedEvents({ page: 0, size: 6 })
      ]);

      setMyTickets(ticketsData.content);
      setPublishedEvents(eventsData.content);
      setTicketsHasMore(!ticketsData.last);
      setEventsHasMore(!eventsData.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTickets = async () => {
    if (loadingMore || !ticketsHasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = ticketsPage + 1;
      const data = await ticketsService.getMyTickets({ page: nextPage, size: 10 });
      
      setMyTickets(prev => [...prev, ...data.content]);
      setTicketsPage(nextPage);
      setTicketsHasMore(!data.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load more tickets');
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreEvents = async () => {
    if (loadingMore || !eventsHasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = eventsPage + 1;
      const data = searchQuery 
        ? await eventsService.searchPublishedEvents(searchQuery, { page: nextPage, size: 10, sort: 'name,asc' })
        : await eventsService.getPublishedEvents({ page: nextPage, size: 6 });
      
      setPublishedEvents(prev => [...prev, ...data.content]);
      setEventsPage(nextPage);
      setEventsHasMore(!data.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load more events');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setEventsPage(0);
    setEventsHasMore(true);
    
    try {
      const data = query 
        ? await eventsService.searchPublishedEvents(query, { page: 0, size: 10, sort: 'name,asc' })
        : await eventsService.getPublishedEvents({ page: 0, size: 6 });
      
      setPublishedEvents(data.content);
      setEventsHasMore(!data.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/published-events/${eventId}`);
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  const handleDownloadQrCode = async (ticketId: string) => {
    try {
      await ticketsService.downloadTicketQrCode(ticketId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download QR code');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
      case 'PURCHASED': return 'status-purchased';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-purchased';
    }
  };

  const renderTicketCard = (ticket: ListTicketResponse) => (
    <div key={ticket.id} className="ticket-card" onClick={() => handleTicketClick(ticket.id)}>
      <div className="ticket-header">
        <h3 className="ticket-type-name">{ticket.ticketType.name}</h3>
        <div className={`ticket-status ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </div>
      </div>
      
      <div className="ticket-details">
        <div className="event-name">{ticket.eventName}</div>
        <div className="ticket-price">{formatPrice(ticket.ticketType.price)}</div>
        <div className="ticket-id">Ticket ID: {ticket.id.slice(0, 8)}...</div>
      </div>

      <div className="ticket-actions" onClick={(e) => e.stopPropagation()}>
        <button 
          className="action-btn download-btn"
          onClick={() => handleDownloadQrCode(ticket.id)}
        >
          Download QR
        </button>
      </div>
    </div>
  );

  const renderEventCard = (event: Event) => (
    <div key={event.id} className="event-card" onClick={() => handleEventClick(event.id)}>
      <div className="event-header">
        <h3 className="event-title">{event.name}</h3>
        <div className={`event-status status-published`}>
          Published
        </div>
      </div>
      
      <div className="event-details">
        <div className="event-info">
          <div className="info-item">
            <span className="info-label">Location:</span>
            <span className="info-value">{event.location}</span>
          </div>
          {event.start && (
            <div className="info-item">
              <span className="info-label">Start:</span>
              <span className="info-value">{formatDate(event.start)}</span>
            </div>
          )}
          {event.end && (
            <div className="info-item">
              <span className="info-label">End:</span>
              <span className="info-value">{formatDate(event.end)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="attendee-landing-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendee-landing-container">
      <div className="attendee-hero">
        <div className="hero-content">
          <div className="welcome-section">
            <h1>Welcome, {userInfo?.name || 'Attendee'}!</h1>
            <p className="hero-subtitle">
              Manage your tickets and discover amazing events
            </p>
          </div>
          
          <div className="action-cards">
            <div className="action-card my-tickets" onClick={() => setActiveTab('tickets')}>
              <div className="card-icon">🎫</div>
              <h3>My Tickets</h3>
              <p>View and manage your purchased tickets</p>
              <div className="card-button">
                <span>View Tickets</span>
                <span className="arrow">→</span>
              </div>
            </div>

            <div className="action-card discover-events" onClick={() => setActiveTab('discover')}>
              <div className="card-icon">🔍</div>
              <h3>Discover Events</h3>
              <p>Browse and purchase tickets for upcoming events</p>
              <div className="card-button">
                <span>Explore Events</span>
                <span className="arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="attendee-content">
        <div className="content-tabs">
          <button 
            className={`tab-button ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            My Tickets ({myTickets.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover Events ({publishedEvents.length})
          </button>
        </div>

        {activeTab === 'discover' && (
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        )}

        <div className="content-grid">
          {activeTab === 'tickets' ? (
            <>
              {myTickets.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎫</div>
                  <h3>No tickets yet</h3>
                  <p>Purchase tickets for events to see them here!</p>
                  <button 
                    className="discover-events-btn"
                    onClick={() => setActiveTab('discover')}
                  >
                    Discover Events
                  </button>
                </div>
              ) : (
                myTickets.map(ticket => renderTicketCard(ticket))
              )}
              
              {ticketsHasMore && (
                <div className="load-more-section">
                  <button 
                    className="load-more-btn"
                    onClick={loadMoreTickets}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Tickets'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {publishedEvents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No events found</h3>
                  <p>{searchQuery ? 'Try a different search term' : 'No published events available'}</p>
                </div>
              ) : (
                publishedEvents.map(event => renderEventCard(event))
              )}
              
              {eventsHasMore && (
                <div className="load-more-section">
                  <button 
                    className="load-more-btn"
                    onClick={loadMoreEvents}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Events'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeLandingPage;
