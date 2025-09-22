package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.TicketStatusEnum;

import java.time.LocalDateTime;
import java.util.UUID;

public record GetTicketResponseDto(
    UUID id,
    TicketStatusEnum status,
    Double price,
    String description,
    String eventName,
    String location,
    LocalDateTime eventStart,
    LocalDateTime eventEnd) {}
