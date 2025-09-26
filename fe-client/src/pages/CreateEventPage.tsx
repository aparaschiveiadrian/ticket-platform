import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './CreateEventPage.css';

interface TicketType {
  name: string;
  price: number;
  description: string;
  totalAvailable: number;
}

interface CreateEventFormData {
  name: string;
  start: string;
  end: string;
  location: string;
  salesStart: string;
  salesEnd: string;
  status: 'DRAFT' | 'PUBLISHED';
  ticketTypeRequestList: TicketType[];
}

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateEventFormData>({
    name: '',
    start: '',
    end: '',
    location: '',
    salesStart: '',
    salesEnd: '',
    status: 'DRAFT',
    ticketTypeRequestList: [
      { name: '', price: 0, description: '', totalAvailable: 0 }
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypeRequestList: prev.ticketTypeRequestList.map((ticketType, i) => 
        i === index ? { ...ticketType, [field]: value } : ticketType
      )
    }));
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypeRequestList: [...prev.ticketTypeRequestList, { name: '', price: 0, description: '', totalAvailable: 0 }]
    }));
  };

  const removeTicketType = (index: number) => {
    if (formData.ticketTypeRequestList.length > 1) {
      setFormData(prev => ({
        ...prev,
        ticketTypeRequestList: prev.ticketTypeRequestList.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Convert form data to match backend expectations
      const requestData = {
        ...formData,
        ticketTypeRequestList: formData.ticketTypeRequestList.map(ticketType => ({
          ...ticketType,
          price: Number(ticketType.price),
          totalAvailable: Number(ticketType.totalAvailable)
        }))
      };

      const response = await apiClient.post('/events', requestData);
      
      // Redirect to events list or event details
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Create New Event</h1>
        <p>Fill in the details below to create your event</p>
      </div>

      <div className="create-event-content">
        <form onSubmit={handleSubmit} className="create-event-form">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  value={formData.start}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end">Event End Date & Time</label>
                <input
                  type="datetime-local"
                  id="end"
                  name="end"
                  value={formData.end}
                  onChange={handleInputChange}
                  disabled={isLoading}
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
                  value={formData.salesStart}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="salesEnd">Sales End Date & Time</label>
                <input
                  type="datetime-local"
                  id="salesEnd"
                  name="salesEnd"
                  value={formData.salesEnd}
                  onChange={handleInputChange}
                  disabled={isLoading}
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
                disabled={isLoading}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
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

            {formData.ticketTypeRequestList.map((ticketType, index) => (
              <div key={index} className="ticket-type-card">
                <div className="ticket-type-header">
                  <h4>Ticket Type {index + 1}</h4>
                  {formData.ticketTypeRequestList.length > 1 && (
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-button"
              disabled={isLoading || !formData.name || !formData.location}
            >
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
