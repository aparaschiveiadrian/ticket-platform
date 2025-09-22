package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.entity.QrCode;
import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import org.springframework.stereotype.Repository;

@Repository
public interface QrCodeService {
  QrCode generateQrCodeForTicket(Ticket ticket);
}
