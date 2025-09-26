import apiClient from './api';
import { ListTicketResponse, GetTicketResponse, PurchaseTicketsResponse, PageResponse } from '../types';

export interface TicketListParams {
  page?: number;
  size?: number;
  sort?: string;
}

class TicketsService {
  // Get attendee's purchased tickets with pagination
  async getMyTickets(params: TicketListParams = {}): Promise<PageResponse<ListTicketResponse>> {
    const { page = 0, size = 10, sort = 'createdAt,desc' } = params;
    
    const response = await apiClient.get<PageResponse<ListTicketResponse>>('/tickets', {
      params: { page, size, sort }
    });
    
    return response.data;
  }

  // Get specific ticket details
  async getTicketDetails(ticketId: string): Promise<GetTicketResponse> {
    const response = await apiClient.get<GetTicketResponse>(`/tickets/${ticketId}`);
    return response.data;
  }

  // Purchase tickets for a specific ticket type
  async purchaseTickets(eventId: string, ticketTypeId: string, quantity: number = 1): Promise<PurchaseTicketsResponse> {
    const response = await apiClient.post<PurchaseTicketsResponse>(
      `/events/${eventId}/ticket-types/${ticketTypeId}/tickets`,
      null,
      {
        params: { quantity }
      }
    );
    return response.data;
  }

  // Get QR code image for a ticket
  async getTicketQrCode(ticketId: string): Promise<Blob> {
    const response = await apiClient.get(`/tickets/${ticketId}/qr-codes`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Download QR code as image
  async downloadTicketQrCode(ticketId: string): Promise<void> {
    try {
      const qrCodeBlob = await this.getTicketQrCode(ticketId);
      const url = window.URL.createObjectURL(qrCodeBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${ticketId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      throw error;
    }
  }
}

export const ticketsService = new TicketsService();
