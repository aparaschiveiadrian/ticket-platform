package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.model.dto.OrganizerStatsDto;
import com.adrianaparaschivei.ticketservice.service.OrganizerStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static com.adrianaparaschivei.ticketservice.util.JwtUtil.parseUserId;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/organizers/stats")
public class OrganizerStatsController {

  private final OrganizerStatsService organizerStatsService;

  @GetMapping
  public ResponseEntity<OrganizerStatsDto> getOrganizerStats(
      @AuthenticationPrincipal Jwt jwt) {
    
    UUID organizerId = parseUserId(jwt);
    OrganizerStatsDto stats = organizerStatsService.getOrganizerStats(organizerId);
    
    return ResponseEntity.ok(stats);
  }
}
