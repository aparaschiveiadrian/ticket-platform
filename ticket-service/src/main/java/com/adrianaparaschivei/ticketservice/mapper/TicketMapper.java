package com.adrianaparaschivei.ticketservice.mapper;

import com.adrianaparaschivei.ticketservice.model.dto.GetTicketResponseDto;
import com.adrianaparaschivei.ticketservice.model.dto.ListTicketResponseDto;
import com.adrianaparaschivei.ticketservice.model.dto.ListTicketTicketTypeResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.Ticket;
import com.adrianaparaschivei.ticketservice.model.entity.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE) // report anything that cannot be mapped
public interface TicketMapper {
  ListTicketTicketTypeResponseDto toListTicketTicketTypeResponseDto(TicketType ticketType);

  @Mapping(target = "eventName" , source = "ticket.ticketType.event.name")
  ListTicketResponseDto toListTicketResponseDto(Ticket ticket);

  @Mapping(target = "price" , source = "ticket.ticketType.price")
  @Mapping(target = "description" , source = "ticket.ticketType.description")
  @Mapping(target = "eventName" , source = "ticket.ticketType.event.name")
  @Mapping(target = "location" , source = "ticket.ticketType.event.location")
  @Mapping(target = "eventStart" , source = "ticket.ticketType.event.start")
  @Mapping(target = "eventEnd" , source = "ticket.ticketType.event.end")
  GetTicketResponseDto toGetTicketResponseDto(Ticket ticket);
}
