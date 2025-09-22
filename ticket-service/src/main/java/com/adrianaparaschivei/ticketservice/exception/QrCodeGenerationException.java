package com.adrianaparaschivei.ticketservice.exception;

public class QrCodeGenerationException extends RuntimeException {
  public QrCodeGenerationException() {
    super();
  }

  public QrCodeGenerationException(String message, Throwable cause) {
    super(message, cause);
  }

  public QrCodeGenerationException(Throwable cause) {
    super(cause);
  }

  protected QrCodeGenerationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }

  public QrCodeGenerationException(String message) {
    super(message);
  }
}
