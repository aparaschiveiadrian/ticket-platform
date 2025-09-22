package com.adrianaparaschivei.ticketservice.repository;

import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
  int countByTicketTypeId(UUID ticketTypeId);
}
