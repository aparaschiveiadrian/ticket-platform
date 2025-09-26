package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.dto.OrganizerStatsDto;

import java.util.UUID;

public interface OrganizerStatsService {
  OrganizerStatsDto getOrganizerStats(UUID organizerId);
}
