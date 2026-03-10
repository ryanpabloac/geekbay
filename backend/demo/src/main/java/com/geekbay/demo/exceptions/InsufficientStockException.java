package com.geekbay.demo.exceptions;

import org.springframework.http.HttpStatus;

public class InsufficientStockException extends BaseException {
    private static final String error = "insufficient:stock";

    public InsufficientStockException(final String message) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, error);
    }
}
