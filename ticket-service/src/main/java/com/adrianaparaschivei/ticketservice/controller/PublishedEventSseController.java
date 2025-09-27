package com.adrianaparaschivei.ticketservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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

import static com.adrianaparaschivei.ticketservice.util.JwtUtil.parseUserId;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/published-events/{eventId}/sse")
@Slf4j
public class PublishedEventSseController {

  //all SSE connections per event(eventId: (sse1,sse2...))
  private static final Map<UUID, CopyOnWriteArraySet<SseEmitter>> eventConnections = new ConcurrentHashMap<>();

  @GetMapping(produces = "text/event-stream")
  public SseEmitter streamEventUpdates(@PathVariable UUID eventId//, @AuthenticationPrincipal Jwt jwt disabled for moment for testing
  ) throws IOException {
    //UUID userId = parseUserId(jwt);

    //10 minutes timeout till Spring calls the onTimeout callback
    SseEmitter emitter = new SseEmitter(10 * 60 * 1000L);
    //adding the new connection
    eventConnections.computeIfAbsent(eventId, k -> new CopyOnWriteArraySet<>()).add(emitter);

    emitter.onCompletion(() -> removeConnection(eventId, emitter));
    emitter.onTimeout(() -> removeConnection(eventId, emitter));
    emitter.onError((ex) -> removeConnection(eventId, emitter));

    // Send initial connection confirmation
    try {
      emitter.send(SseEmitter.event()
              .name("connected")
              .data("Connected to real-time updates for event: " + eventId));
      
      // small delay to ensure connection is stable
      new Thread(() -> {
        try {
          Thread.sleep(200);
          emitter.send(SseEmitter.event()
                  .name("ready")
                  .data("SSE connection is ready for real-time updates"));
          log.info("SSE connection established and ready for event {} with {} total connections",
                  eventId, eventConnections.get(eventId).size());
        } catch (Exception e) {
          log.error("Failed to send ready signal for event {}", eventId, e);
        }
      }).start();
      
    } catch (IOException e) {
      log.error("Failed to send initial SSE message for event {}", eventId, e);
      removeConnection(eventId, emitter);
    }

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

  //called in TicketServiceImpl when purchase is performed
  public static void broadcastTicketUpdate(UUID eventId, UUID ticketTypeId, int newQuantity) {
    CopyOnWriteArraySet<SseEmitter> connections = eventConnections.get(eventId);
    log.debug("Broadcasting ticket update for event {} - Found {} connections", eventId, connections != null ? connections.size() : 0);
    
    //check if there are connections
    if (connections != null && !connections.isEmpty()) {
      //get update message in JSON format
      String updateMessage = String.format("{\"ticketTypeId\":\"%s\",\"newQuantity\":%d}",
              ticketTypeId, newQuantity);

      int initialConnectionCount = connections.size();
      int successfulSends = 0;
      int failedSends = 0;

      connections.removeIf(emitter -> {
        try {
          emitter.send(SseEmitter.event()
                  .name("ticket-update")
                  .data(updateMessage));
          log.debug("Successfully sent SSE update to client for event {}", eventId);
          return false; // Keep connection
        } catch (IOException e) {
          log.warn("Failed to send SSE update to client: {}", e.getMessage());
          return true; // Remove failed connection
        }
      });

      failedSends = initialConnectionCount - connections.size();
      successfulSends = initialConnectionCount - failedSends;
      
      log.info("Broadcasted ticket update for event {} ticket type {} new quantity: {} to {} connections ({} successful, {} failed)",
              eventId, ticketTypeId, newQuantity, initialConnectionCount, successfulSends, failedSends);
    } else {
      log.debug("No SSE connections found for event {}", eventId);
    }
  }
}
