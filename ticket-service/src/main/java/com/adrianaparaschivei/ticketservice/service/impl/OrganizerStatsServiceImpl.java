package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.model.dto.OrganizerStatsDto;
import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import com.adrianaparaschivei.ticketservice.repository.EventRepository;
import com.adrianaparaschivei.ticketservice.repository.TicketRepository;
import com.adrianaparaschivei.ticketservice.service.OrganizerStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrganizerStatsServiceImpl implements OrganizerStatsService {

  private final EventRepository eventRepository;
  private final TicketRepository ticketRepository;

  @Override
  public OrganizerStatsDto getOrganizerStats(UUID organizerId) {
    int totalEvents = eventRepository.countByOrganizerId(organizerId);
    int publishedEvents = eventRepository.countByOrganizerIdAndStatus(organizerId, EventStatusEnum.PUBLISHED);
    int draftEvents = eventRepository.countByOrganizerIdAndStatus(organizerId, EventStatusEnum.DRAFT);
    int totalTicketsSold = ticketRepository.countTicketsSoldByOrganizer(organizerId);
    BigDecimal totalRevenue = ticketRepository.calculateTotalRevenueByOrganizer(organizerId);

    return new OrganizerStatsDto(
            totalEvents,
            totalTicketsSold,
            totalRevenue,
            publishedEvents,
            draftEvents
    );
  }
}