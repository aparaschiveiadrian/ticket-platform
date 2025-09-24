package com.adrianaparaschivei.ticketservice.model.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ConfirmReservationRequestDto(
    @NotNull(message = "Reservation ID cannot be null") UUID reservationId) {}
