package com.geekbay.demo.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidOrderDateException extends BaseException {
    private static final String error = "invalid:order_date";
    public InvalidOrderDateException(String message) {
        super(message, HttpStatus.BAD_REQUEST, error);
    }
}
