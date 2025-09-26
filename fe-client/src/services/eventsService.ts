import apiClient from './api';
import { Event, CreateEventRequest, CreateEventResponse, PageResponse, TicketType } from '../types';

export interface EventListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface EventDetails {
  id: string;
  name: string;
  description?: string;
  location: string;
  start?: string;
  end?: string;
  salesStart?: string;
  salesEnd?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  ticketTypes: TicketType[];
}

export interface UpdateEventRequest {
  id: string;
  name: string;
  start?: string;
  end?: string;
  location: string;
  salesStart?: string;
  salesEnd?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  ticketTypes: UpdateTicketTypeRequest[];
}

export interface UpdateTicketTypeRequest {
  id?: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable: number;
}

class EventsService {
  // Get organizer's own events with pagination
  async getMyEvents(params: EventListParams = {}): Promise<PageResponse<Event>> {
    const { page = 0, size = 8, sort = 'createdAt,desc' } = params;
    
    const response = await apiClient.get<PageResponse<Event>>('/events', {
      params: { page, size, sort }
    });
    
    return response.data;
  }

  // Get published events (other events) with pagination
  async getPublishedEvents(params: EventListParams = {}): Promise<PageResponse<Event>> {
    const { page = 0, size = 8, sort = 'createdAt,desc' } = params;
    
    const response = await apiClient.get<PageResponse<Event>>('/published-events', {
      params: { page, size, sort }
    });
    
    return response.data;
  }

  // Search published events
  async searchPublishedEvents(query: string, params: EventListParams = {}): Promise<PageResponse<Event>> {
    const { page = 0, size = 8, sort = 'createdAt,desc' } = params;
    
    const response = await apiClient.get<PageResponse<Event>>('/published-events', {
      params: { q: query, page, size, sort }
    });
    
    return response.data;
  }

  // Get event details by ID
  async getEventDetails(eventId: string): Promise<EventDetails> {
    const response = await apiClient.get<EventDetails>(`/events/${eventId}`);
    return response.data;
  }

  // Get published event details (public view)
  async getPublishedEventDetails(eventId: string): Promise<EventDetails> {
    const response = await apiClient.get<EventDetails>(`/published-events/${eventId}`);
    return response.data;
  }

  // Create new event
  async createEvent(eventData: CreateEventRequest): Promise<CreateEventResponse> {
    const response = await apiClient.post<CreateEventResponse>('/events', eventData);
    return response.data;
  }

  // Update event
  async updateEvent(eventId: string, eventData: UpdateEventRequest): Promise<EventDetails> {
    const response = await apiClient.put<EventDetails>(`/events/${eventId}`, eventData);
    return response.data;
  }

  // Delete event
  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}`);
  }

  // Create ticket type for an event
  async createTicketType(eventId: string, ticketTypeData: any): Promise<TicketType> {
    const response = await apiClient.post<TicketType>(`/events/${eventId}/ticket-types`, ticketTypeData);
    return response.data;
  }

  // Update ticket type
  async updateTicketType(eventId: string, ticketTypeId: string, ticketTypeData: any): Promise<TicketType> {
    const response = await apiClient.put<TicketType>(`/events/${eventId}/ticket-types/${ticketTypeId}`, ticketTypeData);
    return response.data;
  }

  // Delete ticket type
  async deleteTicketType(eventId: string, ticketTypeId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/ticket-types/${ticketTypeId}`);
  }
}

export const eventsService = new EventsService();
