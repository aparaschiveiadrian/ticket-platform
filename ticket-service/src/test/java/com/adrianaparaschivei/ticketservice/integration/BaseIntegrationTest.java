package com.adrianaparaschivei.ticketservice.integration;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/*
  Base class for integration tests using Testcontainers.
   Uses PostgreSQL Testcontainer
 */
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public abstract class BaseIntegrationTest {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
          .withDatabaseName("testdb")
          .withUsername("test")
          .withPassword("test")
          .withReuse(true); // for faster tests

  static {
    postgres.start();
  }
}
