package com.adrianaparaschivei.ticketservice.model.dto;

import com.adrianaparaschivei.ticketservice.model.enums.TicketValidationMethodEnum;

import java.util.UUID;

// the id could represent to the qr code id, or the ticket id, depends on which validation method
// we're using
public record TicketValidationRequestDto(UUID id, TicketValidationMethodEnum method) {}
