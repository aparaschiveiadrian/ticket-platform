package com.adrianaparaschivei.ticketservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/published-events/{eventId}/sse")
@Slf4j
public class PublishedEventSseController {

  //all SSE connections per event(eventId: (sse1,sse2...))
  private static final Map<UUID, CopyOnWriteArraySet<SseEmitter>> eventConnections = new ConcurrentHashMap<>();

  @GetMapping(produces = "text/event-stream")
  public SseEmitter streamEventUpdates(@PathVariable UUID eventId) throws IOException {
    //10 minutes timeout till Spring calls the onTimeout callback
    SseEmitter emitter = new SseEmitter(10 * 60 * 1000L);
    //adding the new connection
    eventConnections.computeIfAbsent(eventId, k -> new CopyOnWriteArraySet<>()).add(emitter);

    emitter.onCompletion(() -> removeConnection(eventId, emitter));
    emitter.onTimeout(() -> removeConnection(eventId, emitter));
    emitter.onError((ex) -> removeConnection(eventId, emitter));

    emitter.send(SseEmitter.event()//return sseEventBuilderImpl
            .name("connected")
            .data("Connected to real-time updates for event: " + eventId));

    log.info("SSE connection established for event " + eventId);

    return emitter;
  }

  private void removeConnection(UUID eventId, SseEmitter emitter) {
    CopyOnWriteArraySet<SseEmitter> connections = eventConnections.get(eventId);
    if (connections != null) {
      connections.remove(emitter);
      if (connections.isEmpty()) {
        eventConnections.remove(eventId);
      }
    }
  }
}
