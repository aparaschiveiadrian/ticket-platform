package com.adrianaparaschivei.ticketservice.testdata;

import com.adrianaparaschivei.ticketservice.model.CreateTicketTypeRequest;
import com.adrianaparaschivei.ticketservice.model.dto.CreateEventRequestDto;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.model.enums.EventStatusEnum;
import net.datafaker.Faker;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;


// Factory class for generating realistic test data using DataFaker for better general test results
public class TestDataFactory {

  private static final Faker faker = new Faker();

  //create user
  public static User createUser() {
    return User.builder()
            .id(UUID.randomUUID())
            .username(faker.name().firstName().toLowerCase().replaceAll("[^a-z0-9]", "") + faker.number().randomDigit())
            .email(faker.internet().emailAddress())
            .build();
  }

  //create user with role
  public static User createUser(String role) {
    String username = faker.name().firstName().toLowerCase().replaceAll("[^a-z0-9]", "") + faker.number().randomDigit();
    return User.builder()
            .id(UUID.randomUUID())
            .username(role.toLowerCase() + "_" + username)
            .email(role.toLowerCase() + "." + username + "@" + faker.internet().domainName())
            .build();
  }

  //create multiple users
  public static List<User> createUsers(int count) {
    return IntStream.range(0, count)
            .mapToObj(i -> createUser())
            .toList();
  }

  //create event
  public static Event createEvent(User organizer) {
    LocalDateTime eventStart = faker.date().future(30, TimeUnit.DAYS).toInstant()
            .atZone(ZoneId.systemDefault()).toLocalDateTime();
    LocalDateTime eventEnd = eventStart.plusHours(faker.number().numberBetween(2, 8));

    return Event.builder()
            .name(faker.options().option(
                    faker.lorem().sentence(3).replace(".", ""),
                    faker.company().name() + " " + faker.options().option("Conference", "Summit", "Workshop", "Festival"),
                    faker.team().name() + " " + faker.options().option("Championship", "Tournament", "Cup")
            ))
            .description(faker.lorem().paragraph(faker.number().numberBetween(2, 5)))
            .location(faker.options().option(
                    faker.address().streetAddress() + ", " + faker.address().city(),
                    faker.company().name() + " Convention Center",
                    faker.university().name() + " Auditorium",
                    faker.team().name() + " Stadium"
            ))
            .start(eventStart)
            .end(eventEnd)
            .salesStart(faker.date().past(30, TimeUnit.DAYS).toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDateTime())
            .salesEnd(eventStart.minusDays(faker.number().numberBetween(1, 7)))
            .status(faker.options().option(EventStatusEnum.PUBLISHED, EventStatusEnum.DRAFT))
            .organizer(organizer)
            .build();
  }

  //multiple events for organizer
  public static List<Event> createEvents(User organizer, int count) {
    return IntStream.range(0, count)
            .mapToObj(i -> createEvent(organizer))
            .toList();
  }

  //create 1 ticket type
  public static TicketType createTicketType(Event event) {
    String[] ticketNames = {"General Admission", "VIP", "Premium", "Early Bird", "Student", "Senior", "Group"};
    String name = faker.options().option(ticketNames);

    double basePrice = faker.number().randomDouble(2, 25, 500);
    String description = generateTicketDescription(name);

    return TicketType.builder()
            .name(name)
            .description(description)
            .price(basePrice)
            .totalAvailable(faker.number().numberBetween(10, 1000))
            .event(event)
            .build();
  }

  //create 1 ... n ticket types
  public static List<TicketType> createTicketTypes(Event event, int count) {
    return IntStream.range(0, count)
            .mapToObj(i -> createTicketType(event))
            .toList();
  }

  //has organizer and ticket types
  public static EventSetup createCompleteEventSetup() {
    User organizer = createUser("organizer");
    Event event = createEvent(organizer);
    List<TicketType> ticketTypes = createTicketTypes(event, faker.number().numberBetween(2, 5));

    return new EventSetup(organizer, event, ticketTypes);
  }

  //event setups
  public static List<EventSetup> createCompleteEventSetups(int count) {
    return IntStream.range(0, count)
            .mapToObj(i -> createCompleteEventSetup())
            .toList();
  }

  //ticket type descriptions
  private static String generateTicketDescription(String name) {
    String[] features = {
            "includes refreshments",
            "with premium seating",
            "includes parking",
            "with meet & greet access",
            "includes merchandise",
            "with backstage access",
            "includes meal",
            "with priority entry"
    };

    String feature = faker.options().option(features);
    return String.format("%s ticket %s", name, feature);
  }

  //create event request DTO for integration tests
  public static CreateEventRequestDto createEventRequestDto() {
    EventSetup eventSetup = createCompleteEventSetup();
    
    List<CreateTicketTypeRequest> ticketTypeRequests = eventSetup.ticketTypes.stream()
            .map(ticketType -> new CreateTicketTypeRequest(
                    ticketType.getName(),
                    ticketType.getPrice(),
                    ticketType.getDescription(),
                    ticketType.getTotalAvailable()
            ))
            .toList();
    
    return new CreateEventRequestDto(
            eventSetup.event.getName(),
            eventSetup.event.getStart(),
            eventSetup.event.getEnd(),
            eventSetup.event.getLocation(),
            eventSetup.event.getSalesStart(),
            eventSetup.event.getSalesEnd(),
            eventSetup.event.getStatus(),
            ticketTypeRequests
    );
  }

  //complete event setup
  public record EventSetup(User organizer, Event event, List<TicketType> ticketTypes) {
  }
}
