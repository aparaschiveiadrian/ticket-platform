package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public record ListEventResponseDto(
        UUID id,
        String name,
        LocalDateTime start,
        LocalDateTime end,
        String location,
        LocalDateTime salesStart,
        LocalDateTime salesEnd,
        EventStatusEnum status,
        List<ListEventTicketTypeResponseDto> ticketTypes) {}
