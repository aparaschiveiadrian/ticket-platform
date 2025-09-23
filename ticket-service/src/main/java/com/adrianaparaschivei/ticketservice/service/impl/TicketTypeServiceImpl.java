package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.exception.ConcurrentTicketPurchaseException;
import com.adrianaparaschivei.ticketservice.exception.TicketTypeNotFoundException;
import com.adrianaparaschivei.ticketservice.exception.TicketsSoldOutException;
import com.adrianaparaschivei.ticketservice.exception.UserNotFoundException;
import com.adrianaparaschivei.ticketservice.model.dto.PurchaseTicketsResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
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

import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

  private final UserRepository userRepository;
  private final TicketTypeRepository ticketTypeRepository;
  private final TicketRepository ticketRepository;
  private final QrCodeService qrCodeService;

  private static final int MAX_ATTEMPTS = 3;
  private static final int MAX_QTY_PER_REQUEST = 10;
  private static final int WAIT_BETWEEN_ATTEMPTS_MS = 100; // if using thread sleep

  // DOES NOT WORK WITH OPTIMISTIC LOCKING and multiple quantity items buy
  //  @Override
  //  @Transactional
  //  public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
  //    User user =
  //        userRepository
  //            .findById(userId)
  //            .orElseThrow(() -> new UserNotFoundException("User not found!"));
  //
  //    TicketType ticketType =
  //        ticketTypeRepository
  //            .findById(ticketTypeId)
  //            .orElseThrow(() -> new TicketTypeNotFoundException("Ticket type not found!"));
  //
  //    int purchasedTickets = ticketRepository.countByTicketTypeId(ticketTypeId);
  //    Integer totalAvailableTickets = ticketType.getTotalAvailable();
  //
  //    if (totalAvailableTickets != null && purchasedTickets - 1 > totalAvailableTickets) {
  //      throw new TicketsSoldOutException("Tickets are sold out!");
  //    }
  //
  //    Ticket ticket = new Ticket();
  //    ticket.setStatus(TicketStatusEnum.PURCHASED);
  //    ticket.setTicketType(ticketType);
  //    ticket.setPurchaser(user);
  //
  //    Ticket savedTicket = ticketRepository.save(ticket);
  //    qrCodeService.generateQrCodeForTicket(savedTicket);
  //    return ticketRepository.save(savedTicket);
  //  }

  @Override
  @Transactional
  public PurchaseTicketsResponseDto purchaseTickets(UUID userId, UUID ticketTypeId, int quantity) {

    int attempts = 0;
    User purchaser =
            userRepository
                    .findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User not found!"));

    while (true) {
      attempts++;
      //inside the while loop to get the latest version on each retry
      TicketType ticketType =
          ticketTypeRepository
              .findById(ticketTypeId)
              .orElseThrow(() -> new TicketTypeNotFoundException("Ticket type not found!"));

      //Event event = ticketType.getEvent();
      //var now = LocalDateTime.now();
      // if needed later:
      // if (event.getSalesStart() != null && now.isBefore(event.getSalesStart())) throw new
      // EventTicketException("Sales not started");
      // if (event.getSalesEnd() != null && now.isAfter(event.getSalesEnd())) throw new
      // EventTicketException("Sales ended");

      int updated =
          ticketTypeRepository.tryDecrement(ticketTypeId, quantity, ticketType.getVersion());

      if (updated == 1) {

        List<Ticket> tickets =
            IntStream.range(0, quantity)
                .mapToObj(
                    i ->
                        Ticket.builder()
                            .status(TicketStatusEnum.PURCHASED)
                            .ticketType(ticketType)
                            .purchaser(purchaser)
                            .build())
                .toList();

        var saved = ticketRepository.saveAll(tickets);
        saved.forEach(qrCodeService::generateQrCodeForTicket);
        var ticketIds = saved.stream().map(Ticket::getId).toList();
        return new PurchaseTicketsResponseDto(ticketTypeId, quantity, ticketIds);
      }

      // UPDATE failed: check whether it's stock or a race
      TicketType current =
          ticketTypeRepository
              .findById(ticketTypeId)
              .orElseThrow(() -> new TicketTypeNotFoundException("Ticket type not found!"));

      Integer available = current.getTotalAvailable();
      if (available == null || available < quantity) {
        throw new TicketsSoldOutException("Not enough tickets available");
      }

      if (attempts >= MAX_ATTEMPTS) {
        throw new ConcurrentTicketPurchaseException("Concurrent purchase detected, please retry");
      }

      try {
        Thread.sleep((long) WAIT_BETWEEN_ATTEMPTS_MS * attempts);
      } catch (InterruptedException ie) {
        Thread.currentThread().interrupt();
        throw new ConcurrentTicketPurchaseException("Interrupted while retrying purchase");
      }
    }
  }
}
