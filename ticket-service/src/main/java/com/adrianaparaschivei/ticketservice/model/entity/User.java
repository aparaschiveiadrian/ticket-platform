package com.adrianaparaschivei.ticketservice.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "username", nullable = false, unique = true)
  private String username;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  // organize events
  // convention of who owns the 'many' side
  @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL)
  private List<Event> organizedEvents = new ArrayList<>();

  // attending events
  @ManyToMany
  @JoinTable(
      name = "user_attending_events",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "event_id"))
  private List<Event> attendingEvents = new ArrayList<>();

  // staffing events
  @ManyToMany
  @JoinTable(
      name = "user_staffing_events",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "event_id"))
  private List<Event> staffingEvents = new ArrayList<>();

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return Objects.equals(id, user.id) && Objects.equals(username, user.username) && Objects.equals(email, user.email) && Objects.equals(createdAt, user.createdAt) && Objects.equals(updatedAt, user.updatedAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, username, email, createdAt, updatedAt);
  }
}
