package com.adrianaparaschivei.ticketservice.repository;

import com.adrianaparaschivei.ticketservice.model.entity.QrCode;
import com.adrianaparaschivei.ticketservice.model.enums.QrCodeStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QrCodeRepository extends JpaRepository<QrCode, UUID> {
  Optional<QrCode> findByTicketIdAndTicketPurchaserId(UUID ticketId, UUID ticketPurchaseId);
  Optional<QrCode> findByIdAndStatus(UUID id, QrCodeStatusEnum status);
}
