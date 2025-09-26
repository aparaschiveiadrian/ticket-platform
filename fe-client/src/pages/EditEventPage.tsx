import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService } from '../services/eventsService';
import { EventDetails as EventDetailsType } from '../services/eventsService';
import { UpdateEventRequest, UpdateTicketTypeRequest } from '../types';
import './EditEventPage.css';

const EditEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventDetailsType | null>(null);

  const [formData, setFormData] = useState<UpdateEventRequest>({
    id: '',
    name: '',
    start: '',
    end: '',
    location: '',
    salesStart: '',
    salesEnd: '',
    status: 'DRAFT',
    ticketTypes: []
  });

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
      const eventData = await eventsService.getEventDetails(eventId);
      setEvent(eventData);
      
      // Populate form with existing data
      setFormData({
        id: eventData.id,
        name: eventData.name,
        start: eventData.start || '',
        end: eventData.end || '',
        location: eventData.location,
        salesStart: eventData.salesStart || '',
        salesEnd: eventData.salesEnd || '',
        status: eventData.status,
        ticketTypes: eventData.ticketTypes.map(ticketType => ({
          id: ticketType.id,
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description || '',
          totalAvailable: ticketType.totalAvailable
        }))
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleTicketTypeChange = (index: number, field: keyof UpdateTicketTypeRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticketType, i) => 
        i === index ? { ...ticketType, [field]: value } : ticketType
      )
    }));
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: '', price: 0, description: '', totalAvailable: 0 }]
    }));
  };

  const removeTicketType = (index: number) => {
    if (formData.ticketTypes.length > 1) {
      setFormData(prev => ({
        ...prev,
        ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    
    setSaving(true);
    setError(null);

    try {
      // Convert form data to match backend expectations
      const requestData: UpdateEventRequest = {
        ...formData,
        ticketTypes: formData.ticketTypes.map(ticketType => ({
          ...ticketType,
          price: Number(ticketType.price),
          totalAvailable: Number(ticketType.totalAvailable)
        }))
      };

      await eventsService.updateEvent(eventId, requestData);
      navigate(`/events/${eventId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  if (loading) {
    return (
      <div className="edit-event-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="edit-event-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Event Not Found</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/events')} className="back-to-events-btn">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-event-container">
      <div className="edit-event-header">
        <button onClick={() => navigate(`/events/${eventId}`)} className="back-button">
          ← Back to Event Details
        </button>
        <h1>Edit Event</h1>
        <p>Update your event details and ticket types</p>
      </div>

      <div className="edit-event-content">
        <form onSubmit={handleSubmit} className="edit-event-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-section">
            <h3>Event Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Event Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start">Event Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="start"
                  name="start"
                  value={formatDateForInput(formData.start)}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end">Event End Date & Time</label>
                <input
                  type="datetime-local"
                  id="end"
                  name="end"
                  value={formatDateForInput(formData.end)}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salesStart">Sales Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="salesStart"
                  name="salesStart"
                  value={formatDateForInput(formData.salesStart)}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="salesEnd">Sales End Date & Time</label>
                <input
                  type="datetime-local"
                  id="salesEnd"
                  name="salesEnd"
                  value={formatDateForInput(formData.salesEnd)}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Event Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={saving}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Ticket Types</h3>
              <button type="button" onClick={addTicketType} className="add-ticket-type-btn">
                + Add Ticket Type
              </button>
            </div>

            {formData.ticketTypes.map((ticketType, index) => (
              <div key={index} className="ticket-type-card">
                <div className="ticket-type-header">
                  <h4>Ticket Type {index + 1}</h4>
                  {formData.ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="remove-ticket-type-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`ticketName-${index}`}>Ticket Name *</label>
                    <input
                      type="text"
                      id={`ticketName-${index}`}
                      value={ticketType.name}
                      onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                      placeholder="e.g., General Admission"
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`ticketPrice-${index}`}>Price (€) *</label>
                    <input
                      type="number"
                      id={`ticketPrice-${index}`}
                      value={ticketType.price}
                      onChange={(e) => handleTicketTypeChange(index, 'price', Number(e.target.value))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`ticketDescription-${index}`}>Description</label>
                    <textarea
                      id={`ticketDescription-${index}`}
                      value={ticketType.description}
                      onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                      placeholder="Describe what this ticket includes..."
                      rows={3}
                      disabled={saving}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`ticketAvailable-${index}`}>Total Available *</label>
                    <input
                      type="number"
                      id={`ticketAvailable-${index}`}
                      value={ticketType.totalAvailable}
                      onChange={(e) => handleTicketTypeChange(index, 'totalAvailable', Number(e.target.value))}
                      placeholder="100"
                      min="1"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/events/${eventId}`)}
              className="cancel-button"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={saving || !formData.name || !formData.location}
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
