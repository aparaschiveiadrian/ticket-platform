package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UpdateEventRequestDto(
    @NotNull(message = "Event ID must pe provided") UUID id,
    @NotBlank(message = "Event name is required") String name,
    LocalDateTime start,
    LocalDateTime end,
    @NotBlank(message = "Location information is required") String location,
    LocalDateTime salesStart,
    LocalDateTime salesEnd,
    @NotNull(message = "Event status must pe provided") EventStatusEnum status,
    @NotEmpty(message = "At least one ticket type is required") @Valid
        List<UpdateTicketTypeRequestDto> ticketTypes) {}
