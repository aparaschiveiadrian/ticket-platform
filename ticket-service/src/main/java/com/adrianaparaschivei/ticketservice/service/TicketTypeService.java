package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.entity.Ticket;

import java.util.UUID;

public interface TicketTypeService {
  Ticket purchaseTicket(UUID userId, UUID ticketType);
}
