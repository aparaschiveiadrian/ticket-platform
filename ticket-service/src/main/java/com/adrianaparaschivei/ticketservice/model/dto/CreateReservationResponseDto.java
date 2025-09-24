package com.adrianaparaschivei.ticketservice.model.dto;

import java.time.Instant;
import java.util.UUID;

public record CreateReservationResponseDto(
    UUID reservationId, UUID ticketTypeId, int quantity, Instant expiresAt) {}
