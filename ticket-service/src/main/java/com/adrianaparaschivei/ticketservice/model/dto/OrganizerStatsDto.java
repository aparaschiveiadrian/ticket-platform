package com.adrianaparaschivei.ticketservice.model.dto;

import java.math.BigDecimal;

public record OrganizerStatsDto(
    int totalEvents,
    int totalTicketsSold,
    BigDecimal totalRevenue,
    int publishedEvents,
    int draftEvents
) {
}
