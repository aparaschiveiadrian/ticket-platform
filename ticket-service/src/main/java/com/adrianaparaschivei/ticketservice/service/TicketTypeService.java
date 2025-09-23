package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.dto.PurchaseTicketsResponseDto;

import java.util.UUID;

public interface TicketTypeService {
  //Ticket purchaseTicket(UUID userId, UUID ticketType); does not work with optimistic locking
  PurchaseTicketsResponseDto purchaseTickets(UUID userId, UUID ticketTypeId, int quantity);
}
