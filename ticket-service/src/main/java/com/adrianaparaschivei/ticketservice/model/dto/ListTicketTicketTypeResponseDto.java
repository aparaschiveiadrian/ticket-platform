package com.adrianaparaschivei.ticketservice.model.dto;

import java.util.UUID;

public record ListTicketTicketTypeResponseDto(UUID id, String name, Double price) {}
