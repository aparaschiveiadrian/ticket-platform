package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.mapper.EventMapper;
import com.adrianaparaschivei.ticketservice.model.dto.ListPublishedEventResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// This controller will handle requests related to published events
@RestController
@RequestMapping("/api/v1/published-events")
@RequiredArgsConstructor
public class PublishedEventController {

  private final EventService eventService;
  private final EventMapper eventMapper;

  @GetMapping
  public ResponseEntity<Page<ListPublishedEventResponseDto>> listPublishedEvents(
      @RequestParam(required = false) String q, Pageable pageable) {

    Page<Event> events;
    if (q != null && !q.trim().isEmpty()) {
      events = eventService.searchPublishedEvents(q, pageable);
    } else {
      events = eventService.listPublishedEvents(pageable);
    }

    return ResponseEntity.ok(events.map(eventMapper::toListPublishedEventResponseDto));
  }
}
