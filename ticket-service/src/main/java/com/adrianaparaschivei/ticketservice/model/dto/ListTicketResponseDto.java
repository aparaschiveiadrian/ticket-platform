package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.TicketStatusEnum;

import java.util.UUID;

public record ListTicketResponseDto(
    UUID id, TicketStatusEnum status, String eventName, ListTicketTicketTypeResponseDto ticketType) {}
