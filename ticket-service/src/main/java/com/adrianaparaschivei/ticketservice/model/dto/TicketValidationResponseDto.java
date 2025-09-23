package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.TicketValidationStatusEnum;

import java.util.UUID;

public record TicketValidationResponseDto(UUID ticketId, TicketValidationStatusEnum status) {}
