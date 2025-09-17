package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;

import java.time.LocalDateTime;
import java.util.List;

public record CreateEventRequest(
        String name,
        LocalDateTime start,
        LocalDateTime end,
        String venue,
        LocalDateTime salesStart,
        LocalDateTime salesEnd,
        EventStatusEnum status,
        User organizer,
        List<CreateTicketTypeRequest> ticketTypeRequestList) {}
