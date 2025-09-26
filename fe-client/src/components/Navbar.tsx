import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = tokenService.getUserInfo();
  const isOrganizer = tokenService.isOrganizer();
  const isAttendee = tokenService.isAttendee();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const getUserRole = () => {
    if (isOrganizer) return 'Organizer';
    if (isAttendee) return 'Attendee';
    return 'User';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={handleLogoClick}>
          <div className="brand-icon">🎫</div>
          <span className="brand-text">Ticket Platform</span>
        </div>

        <div className="navbar-menu">
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-name">{userInfo?.name || 'User'}</div>
              <div className="user-role">{getUserRole()}</div>
            </div>
            <div className="user-avatar">
              {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
