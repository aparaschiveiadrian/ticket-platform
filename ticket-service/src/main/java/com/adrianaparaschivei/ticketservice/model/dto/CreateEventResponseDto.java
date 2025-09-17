package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CreateEventResponseDto(
    UUID id,
    String name,
    LocalDateTime start,
    LocalDateTime end,
    String venue,
    LocalDateTime salesStart,
    LocalDateTime salesEnd,
    EventStatusEnum status,
    List<CreateTicketTypeResponseDto> ticketTypes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
