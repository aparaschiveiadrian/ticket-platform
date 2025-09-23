package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.model.dto.PurchaseTicketsResponseDto;
import com.adrianaparaschivei.ticketservice.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.adrianaparaschivei.ticketservice.util.JwtUtil.parseUserId;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/events/{eventId}/ticket-types")
public class TicketTypeController {

  private final TicketTypeService ticketTypeService;

  @PostMapping("/{ticketTypeId}/tickets")
  public ResponseEntity<PurchaseTicketsResponseDto> purchaseTicket(
          @AuthenticationPrincipal Jwt jwt,
          @PathVariable UUID ticketTypeId,
          @RequestParam(name = "quantity", defaultValue = "1") int quantity
  ){
    PurchaseTicketsResponseDto result = ticketTypeService.purchaseTickets(parseUserId(jwt), ticketTypeId, quantity);
    return ResponseEntity.ok(result);
  }
}
