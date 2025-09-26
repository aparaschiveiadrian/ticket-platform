import apiClient from './api';
import { TicketValidationRequest, TicketValidationResponse } from '../types';

class TicketValidationService {
  // Validate ticket manually or by QR code
  async validateTicket(request: TicketValidationRequest): Promise<TicketValidationResponse> {
    const response = await apiClient.post<TicketValidationResponse>('/ticket-validations', request);
    return response.data;
  }

  // Validate ticket manually
  async validateTicketManually(ticketId: string): Promise<TicketValidationResponse> {
    return this.validateTicket({
      id: ticketId,
      method: 'MANUAL'
    });
  }

  // Validate ticket by QR code
  async validateTicketByQrCode(ticketId: string): Promise<TicketValidationResponse> {
    return this.validateTicket({
      id: ticketId,
      method: 'QR_SCAN'
    });
  }
}

export const ticketValidationService = new TicketValidationService();
