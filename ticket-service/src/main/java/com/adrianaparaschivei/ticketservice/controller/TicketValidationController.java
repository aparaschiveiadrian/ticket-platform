package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.mapper.TicketValidationMapper;
import com.adrianaparaschivei.ticketservice.model.dto.TicketValidationRequestDto;
import com.adrianaparaschivei.ticketservice.model.dto.TicketValidationResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.TicketValidation;
import com.adrianaparaschivei.ticketservice.model.enums.TicketValidationMethodEnum;
import com.adrianaparaschivei.ticketservice.service.TicketValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/ticket-validations")
public class TicketValidationController {

  private final TicketValidationService ticketValidationService;
  private final TicketValidationMapper ticketValidationMapper;

  @PostMapping
  public ResponseEntity<TicketValidationResponseDto> validateTicket(
      @RequestBody TicketValidationRequestDto ticketValidationRequestDto) {

    TicketValidationMethodEnum method = ticketValidationRequestDto.method();
    TicketValidation ticketValidation;

    if (TicketValidationMethodEnum.MANUAL.equals(method)) {
      ticketValidation =
          ticketValidationService.validateTicketManually(ticketValidationRequestDto.id());
    } else {
      ticketValidation =
          ticketValidationService.validateTicketByQrCode(ticketValidationRequestDto.id());
    }
    return ResponseEntity.ok(
        ticketValidationMapper.toTicketValidationResponseDto(ticketValidation));
  }
}
