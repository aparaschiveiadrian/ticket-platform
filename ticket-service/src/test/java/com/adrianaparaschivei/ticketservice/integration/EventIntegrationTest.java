package com.adrianaparaschivei.ticketservice.integration;

import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import com.adrianaparaschivei.ticketservice.repository.EventRepository;
import com.adrianaparaschivei.ticketservice.repository.TicketTypeRepository;
import com.adrianaparaschivei.ticketservice.repository.UserRepository;
import com.adrianaparaschivei.ticketservice.testdata.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;


// TestDataFactory for realistic test data and BaseIntegrationTest for database setup.

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/db/migration/V1__DDL_Create_Users.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V2__DDL_Create_Events.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V3__DDL_Create_Ticket_Types.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V4__DDL_Create_Tickets.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V5__DDL_Create_QR_Codes.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V6__DDL_Create_Ticket_Validations.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V7__DDL_Create_User_Attending_Events.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V8__DDL_Create_User_Staffing_Events.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class EventIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private UserRepository userRepository;

    private User organizer;

    @BeforeEach
    void setUp() {
        // Create test organizer
        organizer = userRepository.save(TestDataFactory.createUser("organizer"));
    }

    @Test
    @DisplayName("Should demonstrate event creation flow using repositories directly")
    void shouldDemonstrateEventCreationFlow() {
        // create event with ticket types using repositories (bypassing security)
        TestDataFactory.EventSetup eventSetup = TestDataFactory.createCompleteEventSetup();
        eventSetup.event().setOrganizer(organizer);
        
        // Save event
        Event savedEvent = eventRepository.save(eventSetup.event());
        assertThat(savedEvent.getId()).isNotNull();
        assertThat(savedEvent.getName()).isNotNull();
        
        // Save ticket types
        List<TicketType> ticketTypes = eventSetup.ticketTypes().stream()
                .peek(ticketType -> ticketType.setEvent(savedEvent))
                .toList();
        List<TicketType> savedTicketTypes = ticketTypeRepository.saveAll(ticketTypes);
        
        assertThat(savedTicketTypes).hasSize(eventSetup.ticketTypes().size());
        assertThat(savedTicketTypes).allMatch(ticketType -> ticketType.getEvent().equals(savedEvent));

        UUID eventId = savedEvent.getId();
        UUID ticketTypeId = savedTicketTypes.get(0).getId();

        // Step 2: Update event to PUBLISHED status
        savedEvent.setStatus(EventStatusEnum.PUBLISHED);
        Event publishedEvent = eventRepository.save(savedEvent);
        assertThat(publishedEvent.getStatus()).isEqualTo(EventStatusEnum.PUBLISHED);

        Event foundEvent = eventRepository.findById(eventId).orElseThrow();
        assertThat(foundEvent).isNotNull();
        assertThat(foundEvent.getName()).isEqualTo(savedEvent.getName());
        assertThat(foundEvent.getStatus()).isEqualTo(EventStatusEnum.PUBLISHED);

        List<TicketType> foundTicketTypes = ticketTypeRepository.findAll().stream()
                .filter(ticketType -> ticketType.getEvent().getId().equals(eventId))
                .toList();
        assertThat(foundTicketTypes).allMatch(ticketType -> ticketType.getEvent().equals(foundEvent));

        assertThat(foundEvent.getOrganizer().getId()).isEqualTo(organizer.getId());
        assertThat(foundTicketTypes).allMatch(ticketType -> ticketType.getPrice() > 0);
        assertThat(foundTicketTypes).allMatch(ticketType -> ticketType.getTotalAvailable() > 0);
    }

    @Test
    @DisplayName("Should handle event creation with multiple ticket types")
    void shouldHandleEventCreationWithMultipleTicketTypes() {
        TestDataFactory.EventSetup eventSetup = TestDataFactory.createCompleteEventSetup();
        eventSetup.event().setOrganizer(organizer);
        
        // Save event
        Event savedEvent = eventRepository.save(eventSetup.event());
        
        // Save ticket types
        List<TicketType> ticketTypes = eventSetup.ticketTypes().stream()
                .peek(ticketType -> ticketType.setEvent(savedEvent))
                .toList();
        List<TicketType> savedTicketTypes = ticketTypeRepository.saveAll(ticketTypes);
        
        // Verify event and ticket types
        assertThat(savedEvent.getId()).isNotNull();
        assertThat(savedTicketTypes).hasSize(eventSetup.ticketTypes().size());
        
        // Verify each ticket type has unique properties
        assertThat(savedTicketTypes).allMatch(ticketType -> ticketType.getName() != null);
        assertThat(savedTicketTypes).allMatch(ticketType -> ticketType.getPrice() > 0);
        assertThat(savedTicketTypes).allMatch(ticketType -> ticketType.getTotalAvailable() > 0);
        assertThat(savedTicketTypes).allMatch(ticketType -> ticketType.getEvent().equals(savedEvent));
    }

    @Test
    @DisplayName("Should handle event search functionality")
    void shouldHandleEventSearchFunctionality() {
        // Create and publish an event
        TestDataFactory.EventSetup eventSetup = TestDataFactory.createCompleteEventSetup();
        eventSetup.event().setOrganizer(organizer);
        eventSetup.event().setName("Tech Conference 2024");
        eventSetup.event().setStatus(EventStatusEnum.PUBLISHED);
        
        // Save event
        Event savedEvent = eventRepository.save(eventSetup.event());
        
        // Save ticket types
        List<TicketType> ticketTypes = eventSetup.ticketTypes().stream()
                .peek(ticketType -> ticketType.setEvent(savedEvent))
                .toList();
        ticketTypeRepository.saveAll(ticketTypes);

        // Verify event can be found
        Event foundEvent = eventRepository.findById(savedEvent.getId()).orElseThrow();
        assertThat(foundEvent.getName()).isEqualTo("Tech Conference 2024");
        assertThat(foundEvent.getStatus()).isEqualTo(EventStatusEnum.PUBLISHED);
    }

    @Test
    @DisplayName("Should handle event deletion")
    void shouldHandleEventDeletion() {
        // Create an event
        TestDataFactory.EventSetup eventSetup = TestDataFactory.createCompleteEventSetup();
        eventSetup.event().setOrganizer(organizer);
        
        // Save event
        Event savedEvent = eventRepository.save(eventSetup.event());
        UUID eventId = savedEvent.getId();

        // Verify event exists
        assertThat(eventRepository.findById(eventId)).isPresent();

        // Delete the event
        eventRepository.deleteById(eventId);

        // Verify event is deleted
        assertThat(eventRepository.findById(eventId)).isEmpty();
    }

}
