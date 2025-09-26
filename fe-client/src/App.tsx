import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import OrganizerLandingPage from './pages/OrganizerLandingPage';
import CreateEventPage from './pages/CreateEventPage';
import BrowseEventsPage from './pages/BrowseEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EditEventPage from './pages/EditEventPage';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';
import { tokenService } from './services/tokenService';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Organizer Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {tokenService.isOrganizer() ? <OrganizerLandingPage /> : <Dashboard />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events/create" 
            element={
              <ProtectedRoute>
                {tokenService.isOrganizer() ? <CreateEventPage /> : <Navigate to="/dashboard" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                {tokenService.isOrganizer() ? <BrowseEventsPage /> : <Navigate to="/dashboard" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events/:eventId" 
            element={
              <ProtectedRoute>
                <EventDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events/:eventId/edit" 
            element={
              <ProtectedRoute>
                {tokenService.isOrganizer() ? <EditEventPage /> : <Navigate to="/dashboard" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/" 
            element={
              authService.isAuthenticated() ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
