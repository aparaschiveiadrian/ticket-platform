package com.adrianaparaschivei.ticketservice.model.entity;

import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {
  @Id
  @Column(name = "id", nullable = false, updatable = false)
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "location", nullable = false)
  private String location;

  @Column(name = "start", nullable = false)
  LocalDateTime start;

  @Column(name = "end", nullable = false)
  LocalDateTime end;

  @Column(name = "venue", nullable = false)
  private String venue;

  @Column(name = "sales_start", nullable = true) // may be null if not announced yet
  private LocalDateTime salesStart;

  @Column(name = "sales_end", nullable = true)
  private LocalDateTime salesEnd;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private EventStatusEnum status;

  // an organizer can organize many events
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organizer_id", nullable = false)
  private User organizer;

  @ManyToMany(mappedBy = "attendingEvents") // place the configuration inside the user
  private List<User> attendees;

  @ManyToMany(mappedBy = "staffingEvents")
  private List<User> staff;

  @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
  private List<TicketType> ticketTypes = new ArrayList<>();

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) return false;
    Event event = (Event) o;
    return Objects.equals(id, event.id) && Objects.equals(name, event.name) && Objects.equals(description, event.description) && Objects.equals(location, event.location) && Objects.equals(start, event.start) && Objects.equals(end, event.end) && Objects.equals(venue, event.venue) && Objects.equals(salesStart, event.salesStart) && Objects.equals(salesEnd, event.salesEnd) && status == event.status && Objects.equals(createdAt, event.createdAt) && Objects.equals(updatedAt, event.updatedAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, location, start, end, venue, salesStart, salesEnd, status, createdAt, updatedAt);
  }
}
