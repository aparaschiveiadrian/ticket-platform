package com.adrianaparaschivei.ticketservice.service.impl;

import com.adrianaparaschivei.ticketservice.exception.EventNotFoundException;
import com.adrianaparaschivei.ticketservice.exception.EventUpdateException;
import com.adrianaparaschivei.ticketservice.exception.UserNotFoundException;
import com.adrianaparaschivei.ticketservice.model.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.UpdateEventRequest;
import com.adrianaparaschivei.ticketservice.model.UpdateTicketTypeRequest;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.repository.EventRepository;
import com.adrianaparaschivei.ticketservice.repository.UserRepository;
import com.adrianaparaschivei.ticketservice.service.EventService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Locale.filter;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

  private final UserRepository userRepository;
  private final EventRepository eventRepository;

  @Override
  @Transactional
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
        .orElseThrow(() -> new EventNotFoundException("The specified event was not found"));
  }

  @Override
  public Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable) {
    return eventRepository.findByOrganizerId(organizerId, pageable);
  }

  @Override
  @Transactional //
  public Event updateEventForOrganizer(UUID organizerId, UUID id, UpdateEventRequest event) {
    if (event.id() == null) {
      throw new EventUpdateException("Event ID cannot be null");
    }

    if (!id.equals(event.id())) {
      throw new EventUpdateException("Event ID in path and body must be the same");
    }

    Event existingEvent =
        eventRepository
            .findByIdAndOrganizerId(id, organizerId)
            .orElseThrow(
                () -> new EventNotFoundException("Event not found or you are not the organizer"));

    existingEvent.setName(event.name());
    existingEvent.setStart(event.start());
    existingEvent.setEnd(event.end());
    existingEvent.setLocation(event.location());
    existingEvent.setSalesStart(event.salesStart());
    existingEvent.setSalesEnd(event.salesEnd());
    existingEvent.setStatus(event.status());
    // ticket type update

    Set<UUID> requestedTicketTypeIds =
        event.ticketTypes().stream()
            .map(UpdateTicketTypeRequest::id)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

    existingEvent
        .getTicketTypes()
        .removeIf(
            existingTicketType -> !requestedTicketTypeIds.contains(existingTicketType.getId()));

    Map<UUID, TicketType> existingTicketTypesIndex =
        existingEvent.getTicketTypes().stream()
            .collect(Collectors.toMap(TicketType::getId, Function.identity()));

    for (UpdateTicketTypeRequest updateTicketTypeRequest : event.ticketTypes()) {
      if (updateTicketTypeRequest.id() == null) {
        // Create
        TicketType ticketTypeToCreate = new TicketType();
        ticketTypeToCreate.setName(updateTicketTypeRequest.name());
        ticketTypeToCreate.setPrice(updateTicketTypeRequest.price());
        ticketTypeToCreate.setDescription(updateTicketTypeRequest.description());
        ticketTypeToCreate.setTotalAvailable(updateTicketTypeRequest.totalAvailable());
        ticketTypeToCreate.setEvent(existingEvent);

        existingEvent.getTicketTypes().add(ticketTypeToCreate);

      } else if (existingTicketTypesIndex.containsKey(updateTicketTypeRequest.id())) {
        // Update
        TicketType existingTicketType = existingTicketTypesIndex.get(updateTicketTypeRequest.id());
        existingTicketType.setName(updateTicketTypeRequest.name());
        existingTicketType.setPrice(updateTicketTypeRequest.price());
        existingTicketType.setDescription(updateTicketTypeRequest.description());
        existingTicketType.setTotalAvailable(updateTicketTypeRequest.totalAvailable());

      } else {
        throw new EventUpdateException(
            "Ticket type with ID " + updateTicketTypeRequest.id() + " not found in the event");
      }
    }
    return eventRepository.save(existingEvent);
  }

  @Override
  @Transactional
  public void deleteEventForOrganizer(UUID organizerId, UUID id) {
    Event event = getEventForOrganizer(organizerId, id);
    eventRepository.delete(event);
  }
}
