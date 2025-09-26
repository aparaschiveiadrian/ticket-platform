import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import OrganizerLandingPage from './pages/OrganizerLandingPage';
import CreateEventPage from './pages/CreateEventPage';
import BrowseEventsPage from './pages/BrowseEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EditEventPage from './pages/EditEventPage';
import AttendeeLandingPage from './pages/AttendeeLandingPage';
import PublishedEventDetailsPage from './pages/PublishedEventDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
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
                <Layout>
                  {tokenService.isOrganizer() ? <OrganizerLandingPage /> : 
                   tokenService.isAttendee() ? <AttendeeLandingPage /> : 
                   <Dashboard />}
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events/create" 
            element={
              <ProtectedRoute>
                <Layout>
                  {tokenService.isOrganizer() ? <CreateEventPage /> : <Navigate to="/dashboard" replace />}
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <Layout>
                  {tokenService.isOrganizer() ? <BrowseEventsPage /> : <Navigate to="/dashboard" replace />}
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events/:eventId" 
            element={
              <ProtectedRoute>
                <Layout>
                  <EventDetailsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events/:eventId/edit" 
            element={
              <ProtectedRoute>
                <Layout>
                  {tokenService.isOrganizer() ? <EditEventPage /> : <Navigate to="/dashboard" replace />}
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Published Event Details Route for Attendees */}
          <Route 
            path="/published-events/:eventId" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PublishedEventDetailsPage />
                </Layout>
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
