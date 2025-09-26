package com.adrianaparaschivei.ticketservice.model.dto;

import java.util.UUID;

public record GetPublishedEventDetailsTicketTypeResponseDto(
    UUID id, String name, Double price, Integer totalAvailable, String description) {}
