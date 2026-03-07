package com.geekbay.demo.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidValueException extends BaseException {
    private static final String error = "invalid:value";
    public InvalidValueException(String message) {
        super(message, HttpStatus.BAD_REQUEST, error);
    }
}
