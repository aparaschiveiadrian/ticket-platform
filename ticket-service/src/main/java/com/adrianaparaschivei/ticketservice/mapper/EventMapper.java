package com.adrianaparaschivei.ticketservice.mapper;

import com.adrianaparaschivei.ticketservice.model.CreateEventRequest;
import com.adrianaparaschivei.ticketservice.model.CreateTicketTypeRequest;
import com.adrianaparaschivei.ticketservice.model.dto.CreateEventRequestDto;
import com.adrianaparaschivei.ticketservice.model.dto.CreateEventResponseDto;
import com.adrianaparaschivei.ticketservice.model.dto.CreateTicketTypeRequestDto;
import com.adrianaparaschivei.ticketservice.model.dto.CreateTicketTypeResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.Event;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE) // report anything that cannot be mapped
public interface EventMapper {
  // from presentation layer to service layer
  CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

  CreateEventRequest fromDto(CreateEventRequestDto dto);

  CreateEventResponseDto toDto(Event event);

  CreateTicketTypeResponseDto toDto(TicketType ticketType);
}
