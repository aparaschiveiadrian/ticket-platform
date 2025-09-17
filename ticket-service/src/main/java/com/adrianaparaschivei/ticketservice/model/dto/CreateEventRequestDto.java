package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.CreateTicketTypeRequest;
import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

// USED FOR PRESENTATION LAYER
public record CreateEventRequestDto(
    @NotBlank(message = "Event name is required") String name,
    LocalDateTime start,
    LocalDateTime end,
    @NotBlank(message = "Venue information is required") String venue,
    LocalDateTime salesStart,
    LocalDateTime salesEnd,
    @NotNull(message = "Event status is required") EventStatusEnum status,
    @NotEmpty(message = "At least one ticket type is required") @Valid
        List<CreateTicketTypeRequest> ticketTypeRequestList) {}
