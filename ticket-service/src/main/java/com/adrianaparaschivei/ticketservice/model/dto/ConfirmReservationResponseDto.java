package com.adrianaparaschivei.ticketservice.model.dto;

import java.util.List;
import java.util.UUID;

public record ConfirmReservationResponseDto(
        UUID ticketTypeId,
        int quantity,
        List<UUID> ticketIds
) {}