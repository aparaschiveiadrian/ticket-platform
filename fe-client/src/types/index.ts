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
  description: string;
  location: string;
  eventStart: string;
  eventEnd: string;
  salesStart: string;
  salesEnd: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  totalAvailable: number;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
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
