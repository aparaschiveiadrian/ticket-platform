package com.adrianaparaschivei.ticketservice.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PurchaseTicketsRequestDto(
    @NotNull(message = "ticketTypeId is required") UUID ticketTypeId,

    @NotNull(message = "quantity is required")
        @Min(value = 1, message = "quantity must be at least {value}")
        @Max(value = 10, message = "quantity cannot exceed {value}")
        Integer quantity) {}
