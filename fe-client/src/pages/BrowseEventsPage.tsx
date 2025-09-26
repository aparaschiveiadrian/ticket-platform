import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsService } from '../services/eventsService';
import { Event, PageResponse } from '../types';
import './BrowseEventsPage.css';

const BrowseEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'other'>('my');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [otherEvents, setOtherEvents] = useState<Event[]>([]);
  const [myEventsPage, setMyEventsPage] = useState(0);
  const [otherEventsPage, setOtherEventsPage] = useState(0);
  const [myEventsHasMore, setMyEventsHasMore] = useState(true);
  const [otherEventsHasMore, setOtherEventsHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [myEventsData, otherEventsData] = await Promise.all([
        eventsService.getMyEvents({ page: 0, size: 8 }),
        eventsService.getPublishedEvents({ page: 0, size: 8 })
      ]);

      setMyEvents(myEventsData.content);
      setOtherEvents(otherEventsData.content);
      setMyEventsHasMore(!myEventsData.last);
      setOtherEventsHasMore(!otherEventsData.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMyEvents = async () => {
    if (loadingMore || !myEventsHasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = myEventsPage + 1;
      const data = await eventsService.getMyEvents({ page: nextPage, size: 8 });
      
      setMyEvents(prev => [...prev, ...data.content]);
      setMyEventsPage(nextPage);
      setMyEventsHasMore(!data.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load more events');
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreOtherEvents = async () => {
    if (loadingMore || !otherEventsHasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = otherEventsPage + 1;
      const data = searchQuery 
        ? await eventsService.searchPublishedEvents(searchQuery, { page: nextPage, size: 8 })
        : await eventsService.getPublishedEvents({ page: nextPage, size: 8 });
      
      setOtherEvents(prev => [...prev, ...data.content]);
      setOtherEventsPage(nextPage);
      setOtherEventsHasMore(!data.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load more events');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setOtherEventsPage(0);
    setOtherEventsHasMore(true);
    
    try {
      const data = query 
        ? await eventsService.searchPublishedEvents(query, { page: 0, size: 8 })
        : await eventsService.getPublishedEvents({ page: 0, size: 8 });
      
      setOtherEvents(data.content);
      setOtherEventsHasMore(!data.last);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string, eventName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await eventsService.deleteEvent(eventId);
      setMyEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'status-published';
      case 'DRAFT': return 'status-draft';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return 'status-draft';
    }
  };

  const renderEventCard = (event: Event, isOwner: boolean = false) => (
    <div key={event.id} className="event-card" onClick={() => handleEventClick(event.id)}>
      <div className="event-header">
        <h3 className="event-title">{event.name}</h3>
        <div className={`event-status ${getStatusColor(event.status)}`}>
          {event.status}
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

      {isOwner && (
        <div className="event-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="action-btn edit-btn"
            onClick={() => navigate(`/events/${event.id}/edit`)}
          >
            Edit
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => handleDeleteEvent(event.id, event.name)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="browse-events-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-events-container">
      <div className="browse-events-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Browse Events</h1>
        <p>Manage your events and discover others</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="events-content">
        <div className="events-tabs">
          <button 
            className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Events ({myEvents.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'other' ? 'active' : ''}`}
            onClick={() => setActiveTab('other')}
          >
            Other Events ({otherEvents.length})
          </button>
        </div>

        {activeTab === 'other' && (
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

        <div className="events-grid">
          {activeTab === 'my' ? (
            <>
              {myEvents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No events yet</h3>
                  <p>Create your first event to get started!</p>
                  <button 
                    className="create-event-btn"
                    onClick={() => navigate('/events/create')}
                  >
                    Create Event
                  </button>
                </div>
              ) : (
                myEvents.map(event => renderEventCard(event, true))
              )}
              
              {myEventsHasMore && (
                <div className="load-more-section">
                  <button 
                    className="load-more-btn"
                    onClick={loadMoreMyEvents}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Events'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {otherEvents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No events found</h3>
                  <p>{searchQuery ? 'Try a different search term' : 'No published events available'}</p>
                </div>
              ) : (
                otherEvents.map(event => renderEventCard(event, false))
              )}
              
              {otherEventsHasMore && (
                <div className="load-more-section">
                  <button 
                    className="load-more-btn"
                    onClick={loadMoreOtherEvents}
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

export default BrowseEventsPage;
