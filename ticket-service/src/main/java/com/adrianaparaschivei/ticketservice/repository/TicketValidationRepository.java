package com.adrianaparaschivei.ticketservice.repository;

import com.adrianaparaschivei.ticketservice.model.entity.TicketValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TicketValidationRepository extends JpaRepository<TicketValidation, UUID> {}
