package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.exception.UserNotFoundException;
import com.adrianaparaschivei.ticketservice.model.dto.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.repository.EventRepository;
import com.adrianaparaschivei.ticketservice.repository.UserRepository;
import com.adrianaparaschivei.ticketservice.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

  private final UserRepository userRepository;
  private final EventRepository eventRepository;

  @Override
  public Event createEvent(UUID organizerId, CreateEventRequest event) {
    User organizer =
        userRepository
            .findById(organizerId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format("User with ID %s not found", organizerId)));

    List<TicketType> ticketTypesToCreate =
        event.ticketTypeRequestList().stream()
            .map(
                ticketType ->
                    TicketType.builder()
                        .name(ticketType.name())
                        .price(ticketType.price())
                        .description(ticketType.description())
                        .totalAvailable(ticketType.totalAvailable())
                        .build())
            .toList();

    Event eventToCreate =
        Event.builder()
            .name(event.name())
            .start(event.start())
            .end(event.end())
            .venue(event.venue())
            .salesStart(event.salesStart())
            .salesEnd(event.salesEnd())
            .status(event.status())
            .organizer(organizer)
            .ticketTypes(ticketTypesToCreate)
            .build();

    return eventRepository.save(eventToCreate);
  }
}
