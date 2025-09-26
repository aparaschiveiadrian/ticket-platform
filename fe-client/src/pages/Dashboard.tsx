import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Ticket Platform Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to Ticket Platform!</h2>
          <p>You have successfully logged in with Keycloak authentication.</p>
          <p>Your access token is stored securely in cookies.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎫 Events</h3>
            <p>Create and manage events</p>
          </div>
          
          <div className="feature-card">
            <h3>🎟️ Tickets</h3>
            <p>Purchase and validate tickets</p>
          </div>
          
          <div className="feature-card">
            <h3>📱 QR Codes</h3>
            <p>Generate and scan QR codes</p>
          </div>
          
          <div className="feature-card">
            <h3>👥 Users</h3>
            <p>Manage user roles and permissions</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
