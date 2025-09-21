package com.adrianaparaschivei.ticketservice.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ListPublishedEventResponseDto(
    UUID id, String name, LocalDateTime start, LocalDateTime end, String location) {}
