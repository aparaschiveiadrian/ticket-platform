package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.exception.EventNotFoundException;
import com.adrianaparaschivei.ticketservice.exception.UserNotFoundException;
import com.adrianaparaschivei.ticketservice.model.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.repository.EventRepository;
import com.adrianaparaschivei.ticketservice.repository.UserRepository;
import com.adrianaparaschivei.ticketservice.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Event eventToCreate =
        Event.builder()
            .name(event.name())
            .start(event.start())
            .end(event.end())
            .location(event.location())
            .salesStart(event.salesStart())
            .salesEnd(event.salesEnd())
            .status(event.status())
            .organizer(organizer)
            .build();

    List<TicketType> ticketTypesToCreate =
        event.ticketTypeRequestList().stream()
            .map(
                ticketType ->
                    TicketType.builder()
                        .name(ticketType.name())
                        .price(ticketType.price())
                        .description(ticketType.description())
                        .totalAvailable(ticketType.totalAvailable())
                        .event(eventToCreate)
                        .build())
            .toList();

    eventToCreate.setTicketTypes(ticketTypesToCreate);

    return eventRepository.save(eventToCreate);
  }

  @Override
  public Event getEventForOrganizer(UUID organizerId, UUID eventId) {
    return eventRepository
        .findByIdAndOrganizerId(eventId, organizerId)
        .orElseThrow(() -> new EventNotFoundException());
  }

  @Override
  public Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable) {
    return eventRepository.findByOrganizerId(organizerId, pageable);
  }
}
