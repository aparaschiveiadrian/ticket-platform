package com.adrianaparaschivei.ticketservice.exception;

public class ConcurrentTicketPurchaseException extends RuntimeException {
  public ConcurrentTicketPurchaseException() {
    super();
  }

  public ConcurrentTicketPurchaseException(String message, Throwable cause) {
    super(message, cause);
  }

  public ConcurrentTicketPurchaseException(Throwable cause) {
    super(cause);
  }

  protected ConcurrentTicketPurchaseException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }

  public ConcurrentTicketPurchaseException(String message) {
    super(message);
  }
}
