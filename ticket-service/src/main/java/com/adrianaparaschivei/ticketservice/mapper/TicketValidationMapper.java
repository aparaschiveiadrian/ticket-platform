package com.adrianaparaschivei.ticketservice.mapper;

import com.adrianaparaschivei.ticketservice.model.dto.TicketValidationResponseDto;
import com.adrianaparaschivei.ticketservice.model.entity.TicketValidation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE) // report anything that cannot be mapped
public interface TicketValidationMapper {

  @Mapping(target = "ticketId", source = "ticket.id")
  TicketValidationResponseDto toTicketValidationResponseDto(TicketValidation ticketValidation);

}
