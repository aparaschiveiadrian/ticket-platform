package com.adrianaparaschivei.ticketservice.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateTicketTypeResponseDto(
    UUID id,
    String name,
    Double price,
    String description,
    Integer totalAvailable,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
