package com.adrianaparaschivei.ticketservice.repository;

import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
  int countByTicketTypeId(UUID ticketTypeId);
  Page<Ticket> findByPurchaserId(UUID purchaserId, Pageable pageable);
  Optional<Ticket> findByIdAndPurchaserId(UUID ticketId, UUID purchaserId);

  //organizer dashboard
  // get number of sold tickets
  @Query("SELECT COUNT(t) FROM Ticket t " +
         "JOIN t.ticketType tt " +
         "JOIN tt.event e " +
         "WHERE e.organizer.id = :organizerId")
  int countTicketsSoldByOrganizer(@Param("organizerId") UUID organizerId);
  // get revenue for sold tickets
  @Query("SELECT COALESCE(SUM(tt.price), 0) FROM Ticket t " +
         "JOIN t.ticketType tt " +
         "JOIN tt.event e " +
         "WHERE e.organizer.id = :organizerId")
  BigDecimal calculateTotalRevenueByOrganizer(@Param("organizerId") UUID organizerId);
}
