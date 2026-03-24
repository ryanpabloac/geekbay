package com.geekbay.demo.exceptions;

public class ProductUnavailableException extends RuntimeException {
  public ProductUnavailableException(String message) {
    super(message);
  }
}
