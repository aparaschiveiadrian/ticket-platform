package com.adrianaparaschivei.ticketservice.model;

public record CreateTicketTypeRequest(
    String name, Double price, String description, Integer totalAvailable) {}
