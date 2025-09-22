package com.adrianaparaschivei.ticketservice.exception;

public class TicketsSoldOutException extends RuntimeException{
  public TicketsSoldOutException() {
    super();
  }

  public TicketsSoldOutException(String message) {
    super(message);
  }

  public TicketsSoldOutException(String message, Throwable cause) {
    super(message, cause);
  }

  public TicketsSoldOutException(Throwable cause) {
    super(cause);
  }

  protected TicketsSoldOutException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
