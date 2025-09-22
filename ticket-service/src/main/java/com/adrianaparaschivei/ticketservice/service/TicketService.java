package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TicketService {
  Page<Ticket> listTicketsForUser(UUID userId, Pageable pageable);
  Ticket getTicketForUser(UUID userId, UUID ticketId);
}
