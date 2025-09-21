package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.mapper.EventMapper;
import com.adrianaparaschivei.ticketservice.model.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.UpdateEventRequest;
import com.adrianaparaschivei.ticketservice.model.dto.*;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/events")
public class EventController {

  private final EventMapper eventMapper;
  private final EventService eventService;

  @PostMapping
  public ResponseEntity<CreateEventResponseDto> createEvent(
      @AuthenticationPrincipal Jwt jwt,
      @Valid @RequestBody CreateEventRequestDto createEventRequestDto) {

    CreateEventRequest createEventRequest = eventMapper.fromDto(createEventRequestDto);

    UUID userId = parseUserId(jwt);

    Event createdEvent = eventService.createEvent(userId, createEventRequest);

    CreateEventResponseDto responseDto = eventMapper.toDto(createdEvent);

    return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<Page<ListEventResponseDto>> listEvents(
      @AuthenticationPrincipal Jwt jwt, Pageable pageable) {
    UUID userId = parseUserId(jwt);
    Page<Event> events = eventService.listEventsForOrganizer(userId, pageable);
    return ResponseEntity.ok(events.map(eventMapper::toListEventResponseDto));
  }

  @GetMapping("/{eventId}")
  public ResponseEntity<GetEventDetailsResponseDto> getEvent(
      @AuthenticationPrincipal Jwt jwt, @PathVariable UUID eventId) {

    UUID userId = parseUserId(jwt);

    GetEventDetailsResponseDto dto =
        eventMapper.toGetEventDetailsResponseDto(
            eventService.getEventForOrganizer(userId, eventId));

    return ResponseEntity.ok(dto);
  }

  @PutMapping("/{eventId}")
  public ResponseEntity<UpdateEventResponseDto> updateEvent(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable UUID eventId,
      @Valid @RequestBody UpdateEventRequestDto updateEventRequestDto) {
    UpdateEventRequest updateEventRequest = eventMapper.fromDto(updateEventRequestDto);
    UUID userId = parseUserId(jwt);

    Event updatedEvent = eventService.updateEventForOrganizer(userId, eventId, updateEventRequest);

    UpdateEventResponseDto updateEventResponseDto = eventMapper.toUpdateEventResponseDto(updatedEvent);

    return new ResponseEntity<>(updateEventResponseDto, HttpStatus.OK);
  }

  private UUID parseUserId(Jwt jwt) {
    return UUID.fromString(jwt.getSubject());
  }
}
