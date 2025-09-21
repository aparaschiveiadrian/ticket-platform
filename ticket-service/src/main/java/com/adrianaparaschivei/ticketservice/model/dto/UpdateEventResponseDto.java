package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UpdateEventResponseDto(
    UUID id,
    String name,
    LocalDateTime start,
    LocalDateTime end,
    String location,
    LocalDateTime salesStart,
    LocalDateTime salesEnd,
    EventStatusEnum status,
    List<UpdateTicketTypeResponseDto> ticketTypes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
