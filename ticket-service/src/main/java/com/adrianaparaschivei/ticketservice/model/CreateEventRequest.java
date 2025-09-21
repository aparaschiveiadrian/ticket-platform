package com.adrianaparaschivei.ticketservice.model;

import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;

import java.time.LocalDateTime;
import java.util.List;

public record CreateEventRequest(
        String name,
        LocalDateTime start,
        LocalDateTime end,
        String location,
        LocalDateTime salesStart,
        LocalDateTime salesEnd,
        EventStatusEnum status,
        List<CreateTicketTypeRequest> ticketTypeRequestList) {}
