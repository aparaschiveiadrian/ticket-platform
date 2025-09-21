package com.adrianaparaschivei.ticketservice.exception;

public class EventNotFoundException extends RuntimeException {
  public EventNotFoundException() {
    super();
  }

  protected EventNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }

  public EventNotFoundException(Throwable cause) {
    super(cause);
  }

  public EventNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public EventNotFoundException(String message) {
    super(message);
  }
}
