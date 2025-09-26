export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  location: string;
  start: string;
  end: string;
  salesStart?: string;
  salesEnd?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  name: string;
  start?: string;
  end?: string;
  location: string;
  salesStart?: string;
  salesEnd?: string;
  status: 'DRAFT' | 'PUBLISHED';
  ticketTypeRequestList: CreateTicketTypeRequest[];
}

export interface CreateEventResponse {
  id: string;
  name: string;
  start?: string;
  end?: string;
  location: string;
  salesStart?: string;
  salesEnd?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  ticketTypes: CreateTicketTypeResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  totalAvailable: number;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CreateTicketTypeRequest {
  name: string;
  price: number;
  description?: string;
  totalAvailable: number;
}

export interface CreateTicketTypeResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  totalAvailable: number;
  eventId: string;
}

export interface Ticket {
  id: string;
  status: 'PURCHASED' | 'CANCELLED';
  purchaserId: string;
  ticketTypeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QrCode {
  id: string;
  value: string;
  status: 'ACTIVE' | 'EXPIRED';
  ticketId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketValidation {
  id: string;
  status: 'VALID' | 'INVALID' | 'EXPIRED';
  validationMethod: 'QR_SCAN' | 'MANUAL';
  ticketId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface UpdateTicketTypeRequest {
  id?: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable: number;
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

export interface UpdateEventResponse {
  id: string;
  name: string;
  start?: string;
  end?: string;
  location: string;
  salesStart?: string;
  salesEnd?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  ticketTypes: UpdateTicketTypeResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTicketTypeResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  totalAvailable: number;
  eventId: string;
}

// Ticket related types for attendees
export interface ListTicketResponse {
  id: string;
  status: 'PURCHASED' | 'CANCELLED';
  ticketType: ListTicketTicketTypeResponse;
}

export interface ListTicketTicketTypeResponse {
  id: string;
  name: string;
  price: number;
}

export interface PurchaseTicketsResponse {
  ticketTypeId: string;
  quantity: number;
  ticketIds: string[];
}

export interface GetTicketResponse {
  id: string;
  status: 'PURCHASED' | 'CANCELLED';
  price: number;
  description?: string;
  eventName: string;
  location: string;
  eventStart: string;
  eventEnd: string;
}

// Published event details for attendees
export interface GetPublishedEventDetailsResponse {
  id: string;
  name: string;
  start: string;
  end: string;
  location: string;
  description: string;
  totalAvailable: number;
  ticketTypes: GetPublishedEventDetailsTicketTypeResponse[];
}

export interface GetPublishedEventDetailsTicketTypeResponse {
  id: string;
  name: string;
  price: number;
  description: string;
  totalAvailable: number;
}
