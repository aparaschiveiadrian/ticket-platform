package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.mapper.TicketMapper;
import com.adrianaparaschivei.ticketservice.model.dto.GetTicketResponseDto;
import com.adrianaparaschivei.ticketservice.model.dto.ListTicketResponseDto;
import com.adrianaparaschivei.ticketservice.service.QrCodeService;
import com.adrianaparaschivei.ticketservice.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static com.adrianaparaschivei.ticketservice.util.JwtUtil.parseUserId;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tickets")
public class TicketController {

  private final TicketService ticketService;
  private final TicketMapper ticketMapper;
  private final QrCodeService qrCodeService;

  @GetMapping
  public ResponseEntity<Page<ListTicketResponseDto>> listTickets(
      @AuthenticationPrincipal Jwt jwt, Pageable pageable) {
    Page<ListTicketResponseDto> dtoPage =
        ticketService
            .listTicketsForUser(parseUserId(jwt), pageable)
            .map(ticketMapper::toListTicketResponseDto);
    return ResponseEntity.ok(dtoPage);
  }

  @GetMapping("/{ticketId}")
  public ResponseEntity<GetTicketResponseDto> getTicket(
      @AuthenticationPrincipal Jwt jwt, @PathVariable UUID ticketId) {
    return ResponseEntity.ok(
        ticketMapper.toGetTicketResponseDto(
            ticketService.getTicketForUser(parseUserId(jwt), ticketId)));
  }

  @GetMapping("{ticketId}/qr-codes")
  public ResponseEntity<byte[]> getTicketQrCode(
      @AuthenticationPrincipal Jwt jwt, @PathVariable UUID ticketId) {
    byte[] qrCodeImage = qrCodeService.getQrCodeImageForUserAndTicket(parseUserId(jwt), ticketId);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_PNG);
    headers.setContentLength(qrCodeImage.length);

    return ResponseEntity.ok().headers(headers).body(qrCodeImage);
  }
}
