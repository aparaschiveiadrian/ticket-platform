package com.adrianaparaschivei.ticketservice.model.dto;

public record CreateTicketTypeRequest(
    String name, Double price, String description, Integer totalAvailable) {}
