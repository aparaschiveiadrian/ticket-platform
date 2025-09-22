package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.exception.TicketTypeNotFoundException;
import com.adrianaparaschivei.ticketservice.exception.TicketsSoldOutException;
import com.adrianaparaschivei.ticketservice.exception.UserNotFoundException;
import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.model.enums.TicketStatusEnum;
import com.adrianaparaschivei.ticketservice.repository.TicketRepository;
import com.adrianaparaschivei.ticketservice.repository.TicketTypeRepository;
import com.adrianaparaschivei.ticketservice.repository.UserRepository;
import com.adrianaparaschivei.ticketservice.service.QrCodeService;
import com.adrianaparaschivei.ticketservice.service.TicketTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

  private final UserRepository userRepository;
  private final TicketTypeRepository ticketTypeRepository;
  private final TicketRepository ticketRepository;
  private final QrCodeService qrCodeService;

  @Override
  @Transactional
  public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found!"));

    TicketType ticketType =
        ticketTypeRepository
            .findById(ticketTypeId)
            .orElseThrow(() -> new TicketTypeNotFoundException("Ticket type not found!"));

    int purchasedTickets = ticketRepository.countByTicketTypeId(ticketTypeId);
    Integer totalAvailableTickets = ticketType.getTotalAvailable();

    if (totalAvailableTickets != null && purchasedTickets >= totalAvailableTickets) {
      throw new TicketsSoldOutException("Tickets are sold out!");
    }

    Ticket ticket = new Ticket();
    ticket.setStatus(TicketStatusEnum.PURCHASED);
    ticket.setTicketType(ticketType);
    ticket.setPurchaser(user);

    Ticket savedTicket = ticketRepository.save(ticket);
    qrCodeService.generateQrCodeForTicket(savedTicket);
    return ticketRepository.save(savedTicket);
  }
}
