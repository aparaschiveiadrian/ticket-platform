package com.adrianaparaschivei.ticketservice.integration;

import com.adrianaparaschivei.ticketservice.model.dto.GetPublishedEventDetailsResponseDto;
import com.adrianaparaschivei.ticketservice.model.dto.ListPublishedEventResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import com.adrianaparaschivei.ticketservice.repository.EventRepository;
import com.adrianaparaschivei.ticketservice.repository.TicketTypeRepository;
import com.adrianaparaschivei.ticketservice.repository.UserRepository;
import com.adrianaparaschivei.ticketservice.testdata.TestDataFactory;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

// response wrapper for Page deserialization
record PageResponse<T>(
    @JsonProperty("content") List<T> content,
    @JsonProperty("totalElements") long totalElements,
    @JsonProperty("totalPages") int totalPages,
    @JsonProperty("size") int size,
    @JsonProperty("number") int number,
    @JsonProperty("first") boolean first,
    @JsonProperty("last") boolean last,
    @JsonProperty("numberOfElements") int numberOfElements,
    @JsonProperty("empty") boolean empty
) {}

// for testing public event listing, search, and details functionality
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/db/migration/V1__DDL_Create_Users.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V2__DDL_Create_Events.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V3__DDL_Create_Ticket_Types.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V4__DDL_Create_Tickets.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V5__DDL_Create_QR_Codes.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V6__DDL_Create_Ticket_Validations.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V7__DDL_Create_User_Attending_Events.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@Sql(scripts = "/db/migration/V8__DDL_Create_User_Staffing_Events.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class PublishedEventIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @LocalServerPort
    private int port;

    private String baseUrl;
    private User organizer;
    private Event publishedEvent;
    private Event draftEvent;
    private List<TicketType> publishedEventTicketTypes;

    @BeforeEach
    void cleanupDatabase() {
        // Clean up any existing data before each test
        ticketTypeRepository.deleteAll();
        eventRepository.deleteAll();
        userRepository.deleteAll();
    }

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
        
        // Create test organizer
        organizer = userRepository.save(TestDataFactory.createUser("organizer"));
        
        // Create published event with ticket types
        TestDataFactory.EventSetup publishedEventSetup = TestDataFactory.createCompleteEventSetup();
        publishedEventSetup.event().setOrganizer(organizer);
        publishedEventSetup.event().setName("Tech Conference 2024");
        publishedEventSetup.event().setStatus(EventStatusEnum.PUBLISHED);
        publishedEventSetup.event().setDescription("Annual technology conference");
        
        publishedEvent = eventRepository.save(publishedEventSetup.event());
        
        publishedEventTicketTypes = publishedEventSetup.ticketTypes().stream()
                .peek(ticketType -> ticketType.setEvent(publishedEvent))
                .toList();
        ticketTypeRepository.saveAll(publishedEventTicketTypes);
        
        // Create draft event (should not appear in published events)
        TestDataFactory.EventSetup draftEventSetup = TestDataFactory.createCompleteEventSetup();
        draftEventSetup.event().setOrganizer(organizer);
        draftEventSetup.event().setName("Draft Event");
        draftEventSetup.event().setStatus(EventStatusEnum.DRAFT);
        
        draftEvent = eventRepository.save(draftEventSetup.event());
        
        List<TicketType> draftTicketTypes = draftEventSetup.ticketTypes().stream()
                .peek(ticketType -> ticketType.setEvent(draftEvent))
                .toList();
        ticketTypeRepository.saveAll(draftTicketTypes);
    }

    @Test
    @DisplayName("Should list all published events")
    void shouldListAllPublishedEvents() {
        // Call the published events endpoint using custom PageResponse wrapper
        ResponseEntity<PageResponse<ListPublishedEventResponseDto>> response = restTemplate.exchange(
                baseUrl + "/api/v1/published-events?page=0&size=10",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<PageResponse<ListPublishedEventResponseDto>>() {}
        );

        // Verify response
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        
        // Verify that only published events are returned
        PageResponse<ListPublishedEventResponseDto> eventsPage = response.getBody();
        assertThat(eventsPage.content()).hasSize(1); // Only the published event
        
        // Verify the published event is in the results
        List<ListPublishedEventResponseDto> events = eventsPage.content();
        assertThat(events).isNotEmpty();
        assertThat(events.get(0).name()).isEqualTo("Tech Conference 2024");
    }

    @Test
    @DisplayName("Should search published events by query")
    void shouldSearchPublishedEventsByQuery() {
        // Search for events containing "Tech"
        ResponseEntity<PageResponse<ListPublishedEventResponseDto>> response = restTemplate.exchange(
                baseUrl + "/api/v1/published-events?q=Tech&page=0&size=10",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<PageResponse<ListPublishedEventResponseDto>>() {}
        );

        // Verify response
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        
        // Verify search results
        PageResponse<ListPublishedEventResponseDto> eventsPage = response.getBody();
        assertThat(eventsPage.content()).hasSize(1); // Should find the Tech Conference
        
        // Search for non-existent event
        ResponseEntity<PageResponse<ListPublishedEventResponseDto>> noResultsResponse = restTemplate.exchange(
                baseUrl + "/api/v1/published-events?q=Nonexistent&page=0&size=10",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<PageResponse<ListPublishedEventResponseDto>>() {}
        );

        assertThat(noResultsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(noResultsResponse.getBody()).isNotNull();
        assertThat(noResultsResponse.getBody().content()).isEmpty();
    }

    @Test
    @DisplayName("Should get published event details")
    void shouldGetPublishedEventDetails() {
        // Get details for the published event
        ResponseEntity<GetPublishedEventDetailsResponseDto> response = restTemplate.getForEntity(
                baseUrl + "/api/v1/published-events/" + publishedEvent.getId(),
                GetPublishedEventDetailsResponseDto.class
        );

        // Verify response
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        
        // Verify the event details
        GetPublishedEventDetailsResponseDto eventDetails = response.getBody();
        assertThat(eventDetails.id()).isEqualTo(publishedEvent.getId());
        assertThat(eventDetails.name()).isEqualTo("Tech Conference 2024");
        assertThat(eventDetails.description()).isEqualTo("Annual technology conference");
        assertThat(eventDetails.ticketTypes()).hasSize(publishedEventTicketTypes.size());
    }

    @Test
    @DisplayName("Should return 404 for non-existent published event")
    void shouldReturn404ForNonExistentPublishedEvent() {
        UUID nonExistentEventId = UUID.randomUUID();
        
        ResponseEntity<Object> response = restTemplate.getForEntity(
                baseUrl + "/api/v1/published-events/" + nonExistentEventId,
                Object.class
        );

        // Verify 404 response
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Should return 404 for draft event details")
    void shouldReturn404ForDraftEventDetails() {
        // Try to get details for draft event (should not be accessible via published events endpoint)
        ResponseEntity<Object> response = restTemplate.getForEntity(
                baseUrl + "/api/v1/published-events/" + draftEvent.getId(),
                Object.class
        );

        // Verify 404 response (draft events should not be accessible via published events endpoint)
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Should handle pagination correctly")
    void shouldHandlePaginationCorrectly() {
        // Test with small page size
        ResponseEntity<PageResponse<ListPublishedEventResponseDto>> response = restTemplate.exchange(
                baseUrl + "/api/v1/published-events?page=0&size=1",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<PageResponse<ListPublishedEventResponseDto>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        
        PageResponse<ListPublishedEventResponseDto> eventsPage = response.getBody();
        assertThat(eventsPage.content()).hasSize(1);
        assertThat(eventsPage.totalElements()).isEqualTo(1);
        assertThat(eventsPage.totalPages()).isEqualTo(1);
    }

    @Test
    @DisplayName("Should handle empty search query")
    void shouldHandleEmptySearchQuery() {
        // Test with empty search query (should return all published events)
        ResponseEntity<PageResponse<ListPublishedEventResponseDto>> response = restTemplate.exchange(
                baseUrl + "/api/v1/published-events?q=&page=0&size=10",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<PageResponse<ListPublishedEventResponseDto>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        
        PageResponse<ListPublishedEventResponseDto> eventsPage = response.getBody();
        assertThat(eventsPage.content()).hasSize(1); // Should return all published events
    }

    @Test
    @DisplayName("Should verify published event data integrity")
    void shouldVerifyPublishedEventDataIntegrity() {
        // Verify the published event exists in repository
        Event foundEvent = eventRepository.findById(publishedEvent.getId()).orElseThrow();
        assertThat(foundEvent.getStatus()).isEqualTo(EventStatusEnum.PUBLISHED);
        assertThat(foundEvent.getName()).isEqualTo("Tech Conference 2024");
        assertThat(foundEvent.getDescription()).isEqualTo("Annual technology conference");
        
        // Verify ticket types are associated
        List<TicketType> foundTicketTypes = ticketTypeRepository.findAll().stream()
                .filter(ticketType -> ticketType.getEvent().getId().equals(publishedEvent.getId()))
                .toList();
        assertThat(foundTicketTypes).hasSize(publishedEventTicketTypes.size());
        assertThat(foundTicketTypes).allMatch(ticketType -> ticketType.getEvent().getId().equals(foundEvent.getId()));
        
        // Verify draft event is not published
        Event foundDraftEvent = eventRepository.findById(draftEvent.getId()).orElseThrow();
        assertThat(foundDraftEvent.getStatus()).isEqualTo(EventStatusEnum.DRAFT);
    }
}
