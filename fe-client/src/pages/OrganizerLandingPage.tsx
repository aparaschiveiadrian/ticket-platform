import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../services/tokenService';
import { organizerStatsService, OrganizerStats } from '../services/organizerStatsService';
import './OrganizerLandingPage.css';

const OrganizerLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = tokenService.getUserInfo();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrganizerStats();
  }, []);

  const loadOrganizerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const organizerStats = await organizerStatsService.getOrganizerStats();
      setStats(organizerStats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load statistics');
      console.error('Error loading organizer stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const handleBrowseEvents = () => {
    navigate('/events');
  };

  return (
    <div className="organizer-landing">
      <div className="organizer-hero">
        <div className="hero-content">
          <div className="welcome-section">
            <h1>Welcome back, {userInfo?.name || 'Organizer'}!</h1>
            <p className="hero-subtitle">
              Manage your events and create amazing experiences for your attendees
            </p>
          </div>
          
          <div className="action-cards">
            <div className="action-card create-event" onClick={handleCreateEvent}>
              <div className="card-icon">🎪</div>
              <h3>Create New Event</h3>
              <p>Set up a new event with custom ticket types, pricing, and details</p>
              <div className="card-button">
                <span>Get Started</span>
                <span className="arrow">→</span>
              </div>
            </div>

            <div className="action-card browse-events" onClick={handleBrowseEvents}>
              <div className="card-icon">📋</div>
              <h3>Browse Events</h3>
              <p>View and manage your existing events, check analytics and sales</p>
              <div className="card-button">
                <span>View Events</span>
                <span className="arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="organizer-stats">
        <div className="stats-container">
          {loading ? (
            <div className="stats-loading">
              <div className="loading-spinner"></div>
              <p>Loading statistics...</p>
            </div>
          ) : error ? (
            <div className="stats-error">
              <p>Failed to load statistics</p>
              <button onClick={loadOrganizerStats} className="retry-btn">
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="stat-card">
                <div className="stat-number">{stats?.totalEvents || 0}</div>
                <div className="stat-label">Total Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{organizerStatsService.formatNumber(stats?.totalTicketsSold || 0)}</div>
                <div className="stat-label">Tickets Sold</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats?.publishedEvents || 0}</div>
                <div className="stat-label">Published Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{organizerStatsService.formatCurrency(stats?.totalRevenue || 0)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="organizer-features">
        <div className="features-container">
          <h2>Everything you need to manage events</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎫</div>
              <h4>Multiple Ticket Types</h4>
              <p>Create different pricing tiers and categories for your events</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h4>QR Code Validation</h4>
              <p>Secure entry management with QR code scanning</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Real-time Analytics</h4>
              <p>Track sales, attendance, and performance metrics</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h4>Secure Payments</h4>
              <p>Safe and reliable payment processing for all transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLandingPage;
