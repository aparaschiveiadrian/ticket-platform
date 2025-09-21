package com.adrianaparaschivei.ticketservice.exception;

public class EventUpdateException extends RuntimeException {
  public EventUpdateException() {
    super();
  }

  public EventUpdateException(String message, Throwable cause) {
    super(message, cause);
  }

  public EventUpdateException(Throwable cause) {
    super(cause);
  }

  protected EventUpdateException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }

  public EventUpdateException(String message) {
    super(message);
  }
}
