package com.adrianaparaschivei.ticketservice.repository;

import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {
  Optional<TicketType> findById(UUID id);

  @Modifying //execute update query
  @Query(
"""
  update TicketType t
  set t.totalAvailable = t.totalAvailable - :qty,
      t.version = t.version + 1
  where t.id = :id
    and t.totalAvailable >= :qty
    and t.version = :expectedVersion
""")
  int tryDecrement(
      @Param("id") UUID id, @Param("qty") int qty, @Param("expectedVersion") long expectedVersion);
}
