package com.adrianaparaschivei.ticketservice.controller;

import com.adrianaparaschivei.ticketservice.exception.UserNotFoundException;
import com.adrianaparaschivei.ticketservice.model.dto.ErrorDto;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

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

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDto> handleException(Exception ex) {
    log.error("Caught exception: ", ex);
    ErrorDto errorDto = new ErrorDto("An unknown error occurred.");
    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
