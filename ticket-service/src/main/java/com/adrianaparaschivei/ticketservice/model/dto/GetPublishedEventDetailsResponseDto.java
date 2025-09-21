package com.adrianaparaschivei.ticketservice.model.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record GetPublishedEventDetailsResponseDto(
    UUID id,
    String name,
    LocalDateTime start,
    LocalDateTime end,
    String location,
    String description,
    Integer totalAvailable,
    List<GetPublishedEventDetailsTicketTypeResponseDto> ticketTypes) {}
