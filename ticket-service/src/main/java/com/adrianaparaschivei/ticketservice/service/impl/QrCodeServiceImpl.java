package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.exception.QrCodeGenerationException;
import com.adrianaparaschivei.ticketservice.exception.QrCodeNotFoundException;
import com.adrianaparaschivei.ticketservice.model.entity.QrCode;
import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import com.adrianaparaschivei.ticketservice.model.enums.QrCodeStatusEnum;
import com.adrianaparaschivei.ticketservice.repository.QrCodeRepository;
import com.adrianaparaschivei.ticketservice.service.QrCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeServiceImpl implements QrCodeService {

  private static final int QR_HEIGHT = 300;
  private static final int QR_WIDTH = 300;

  private final QrCodeRepository qrCodeRepository;
  private final QRCodeWriter qrCodeWriter;

  @Override
  public QrCode generateQrCodeForTicket(Ticket ticket) {
    try {
      UUID uniqueId = UUID.randomUUID();
      String qrCodeImage = generateQrCodeImage(uniqueId);

      QrCode qrCode = new QrCode();
      qrCode.setId(uniqueId);
      qrCode.setStatus(QrCodeStatusEnum.ACTIVE);
      qrCode.setValue(qrCodeImage);
      qrCode.setTicket(ticket);
      return qrCodeRepository.saveAndFlush(qrCode);

    } catch (WriterException | IOException e) {
      throw new QrCodeGenerationException("Failed to generate QR code");
    }
  }

  @Override
  public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
    QrCode qrCode = qrCodeRepository
        .findByTicketIdAndTicketPurchaserId(ticketId, userId)
        .orElseThrow(
            () -> new QrCodeNotFoundException("QR code not found for the given user and ticket"));
    //decode to Base64
    try{
      return Base64.getDecoder().decode(qrCode.getValue());
    }
    catch(IllegalArgumentException ex){
      log.error("Failed to decode QR code image", ex);
      throw new QrCodeNotFoundException("Failed to decode QR code image");
    }
  }

  private String generateQrCodeImage(UUID uniqueId) throws WriterException, IOException {
    BitMatrix bitMatrix =
        qrCodeWriter.encode(uniqueId.toString(), BarcodeFormat.QR_CODE, QR_WIDTH, QR_HEIGHT);

    BufferedImage qrCodeImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
      ImageIO.write(qrCodeImage, "PNG", baos);
      byte[] imageBytes = baos.toByteArray();

      return Base64.getEncoder().encodeToString(imageBytes);
    }
  }
}
