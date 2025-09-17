package com.adrianaparaschivei.ticketservice.service;

import com.adrianaparaschivei.ticketservice.model.dto.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.entity.Event;

import java.util.UUID;

public interface EventService {
  Event createEvent(UUID organizerId, CreateEventRequest event);
}
