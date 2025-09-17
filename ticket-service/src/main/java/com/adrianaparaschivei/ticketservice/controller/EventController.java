package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.mapper.EventMapper;
import com.adrianaparaschivei.ticketservice.model.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.dto.CreateEventRequestDto;
import com.adrianaparaschivei.ticketservice.model.dto.CreateEventResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    UUID userId = UUID.fromString(jwt.getSubject());

    Event createdEvent = eventService.createEvent(userId, createEventRequest);

    CreateEventResponseDto responseDto = eventMapper.toDto(createdEvent);

    return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
  }
}
