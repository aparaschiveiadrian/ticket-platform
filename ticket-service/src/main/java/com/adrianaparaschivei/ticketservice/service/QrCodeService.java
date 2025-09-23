package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.entity.QrCode;
import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QrCodeService {
  QrCode generateQrCodeForTicket(Ticket ticket);

  byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
