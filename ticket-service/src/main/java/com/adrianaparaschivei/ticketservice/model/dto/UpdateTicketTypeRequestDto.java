package com.adrianaparaschivei.ticketservice.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.UUID;

public record UpdateTicketTypeRequestDto(
    UUID id,
    @NotBlank(message = "Ticket type name must not be blank") String name,
    @NotNull(message = "Price is required")
        @PositiveOrZero(message = "Price must be zero or positive")
        Double price,
    String description,
    Integer totalAvailable) {}
