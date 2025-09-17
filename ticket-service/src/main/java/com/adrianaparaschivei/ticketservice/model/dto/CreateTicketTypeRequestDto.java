package com.adrianaparaschivei.ticketservice.model.dto;

// USED FOR PRESENTATION LAYER
public record CreateTicketTypeRequestDto(
    String name, Double price, String description, Integer totalAvailable) {}
