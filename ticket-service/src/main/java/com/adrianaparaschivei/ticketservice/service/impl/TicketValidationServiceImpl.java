package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.exception.QrCodeNotFoundException;
import com.adrianaparaschivei.ticketservice.exception.TicketNotFoundException;
import com.adrianaparaschivei.ticketservice.model.entity.QrCode;
import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import com.adrianaparaschivei.ticketservice.model.entity.TicketValidation;
import com.adrianaparaschivei.ticketservice.model.enums.QrCodeStatusEnum;
import com.adrianaparaschivei.ticketservice.model.enums.TicketValidationMethodEnum;
import com.adrianaparaschivei.ticketservice.model.enums.TicketValidationStatusEnum;
import com.adrianaparaschivei.ticketservice.repository.QrCodeRepository;
import com.adrianaparaschivei.ticketservice.repository.TicketRepository;
import com.adrianaparaschivei.ticketservice.repository.TicketValidationRepository;
import com.adrianaparaschivei.ticketservice.service.TicketValidationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

  private final QrCodeRepository qrCodeRepository;
  private final TicketValidationRepository ticketValidationRepository;
  private final TicketRepository ticketRepository;

  @Override
  public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
    QrCode qrCode =
        qrCodeRepository
            .findByIdAndStatus(qrCodeId, QrCodeStatusEnum.ACTIVE)
            .orElseThrow(() -> new QrCodeNotFoundException("QR code not found or inactive"));

    Ticket ticket = qrCode.getTicket();

    return validateTicket(ticket);
  }

  @Override
  public TicketValidation validateTicketManually(UUID ticketId) {
    Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TicketNotFoundException::new);
    return validateTicket(ticket);
  }

  private TicketValidation validateTicket(Ticket ticket) {
    TicketValidation ticketValidation = new TicketValidation();
    ticketValidation.setTicket(ticket);
    ticketValidation.setValidationMethod(TicketValidationMethodEnum.QR_SCAN);

    TicketValidationStatusEnum ticketValidationStatus =
        ticket.getValidations().stream()
            .filter(v -> TicketValidationStatusEnum.VALID.equals(v.getStatus()))
            .findFirst()
            .map(v -> TicketValidationStatusEnum.INVALID)
            .orElse(TicketValidationStatusEnum.VALID);

    ticketValidation.setStatus(ticketValidationStatus);

    return ticketValidationRepository.save(ticketValidation);
  }
}
