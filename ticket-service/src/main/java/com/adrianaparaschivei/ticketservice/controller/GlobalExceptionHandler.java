package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.exception.*;
import com.adrianaparaschivei.ticketservice.model.dto.ErrorDto;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(ConcurrentTicketPurchaseException.class)
  public ResponseEntity<ErrorDto> handleConcurrentTicketPurchaseException(
      ConcurrentTicketPurchaseException ex) {
    log.error("Caught ConcurrentTicketPurchaseException: ", ex);

    ErrorDto errorDto =
        new ErrorDto(
            "Could not complete the purchase due to concurrent updates. Please try again.");
    return new ResponseEntity<>(errorDto, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(TicketNotFoundException.class)
  public ResponseEntity<ErrorDto> handleTicketNotFoundException(TicketNotFoundException ex) {
    log.error("Caught TicketNotFoundException: ", ex);

    ErrorDto errorDto = new ErrorDto("Ticket not found!");
    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(TicketsSoldOutException.class)
  public ResponseEntity<ErrorDto> handleTicketsSoldOutException(TicketsSoldOutException ex) {
    log.error("Caught TicketsSoldOutException: ", ex);

    ErrorDto errorDto = new ErrorDto("Tickets are sold out!");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(QrCodeNotFoundException.class)
  public ResponseEntity<ErrorDto> handleQrCodeNotFoundException(QrCodeNotFoundException ex) {
    log.error("Caught QrCodeNotFoundException: ", ex);

    ErrorDto errorDto = new ErrorDto("QR code not found!");
    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(QrCodeGenerationException.class)
  public ResponseEntity<ErrorDto> handleQrCodeGenerationException(QrCodeGenerationException ex) {
    log.error("Caught QrCodeGenerationException: ", ex);

    ErrorDto errorDto = new ErrorDto("QR code generation failed!");
    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(EventUpdateException.class)
  public ResponseEntity<ErrorDto> handleEventUpdateException(EventUpdateException ex) {
    log.error("Caught EventUpdateException: ", ex);

    ErrorDto errorDto = new ErrorDto("Event update failed!");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(TicketTypeNotFoundException.class)
  public ResponseEntity<ErrorDto> handleTicketTypeNotFoundException(
      TicketTypeNotFoundException ex) {
    log.error("Caught TicketTypeNotFoundException: ", ex);

    ErrorDto errorDto = new ErrorDto("Ticket type not found! ");
    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(EventNotFoundException.class)
  public ResponseEntity<ErrorDto> handleEventNotFoundException(EventNotFoundException ex) {
    log.error("Caught EventNotFoundException: ", ex);

    ErrorDto errorDto = new ErrorDto("Event not found! ");
    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorDto> handleUserNotFoundException(
      com.adrianaparaschivei.ticketservice.exception.UserNotFoundException ex) {
    log.error("Caught UserNotFoundException: ", ex);

    ErrorDto errorDto = new ErrorDto("User not found! ");
    // the user has to be authenticated, maybe the token is expired, so it's a better fit than 404
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorDto> handleMethodArgumentNotValidException(
      org.springframework.web.bind.MethodArgumentNotValidException ex) {
    log.error("Caught MethodArgumentNotValidException: ", ex);

    String errorMessage =
        ex.getBindingResult().getAllErrors().stream()
            .findFirst()
            .map(error -> error.getDefaultMessage())
            .orElse("Validation error occurred!");

    ErrorDto errorDto = new ErrorDto(errorMessage);

    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorDto> handleConstraintViolationException(
      ConstraintViolationException ex) {
    log.error("Caught ConstraintViolationException: ", ex);

    String errorMessage =
        ex.getConstraintViolations().stream()
            .findFirst()
            .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
            .orElse("Constraint violation error occurred!");

    ErrorDto errorDto = new ErrorDto(errorMessage);

    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorDto> handleDataIntegrityViolationException(
      DataIntegrityViolationException ex) {
    log.error("Caught DataIntegrityViolationException: ", ex);

    String errorMessage = "Data validation error occurred.";
    if (ex.getMessage() != null && ex.getMessage().contains("null value")) {
      errorMessage = "Required field is missing or invalid.";
    }

    ErrorDto errorDto = new ErrorDto(errorMessage);
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDto> handleException(Exception ex) {
    log.error("Caught exception: ", ex);
    ErrorDto errorDto = new ErrorDto("An unknown error occurred.");
    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
