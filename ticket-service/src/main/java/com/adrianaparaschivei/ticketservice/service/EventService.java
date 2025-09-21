package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface EventService {
  Event createEvent(UUID organizerId, CreateEventRequest event);

  Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable);

  Event getEventForOrganizer(UUID organizerId, UUID id); // to check details of an event
}
