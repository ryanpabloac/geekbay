package com.geekbay.demo.exceptions;

import org.springframework.http.HttpStatus;

public class AlreadyExistsException extends BaseException {

    private static final String error = "data:conflict";

    public AlreadyExistsException(final String message) {
        super(message, HttpStatus.CONFLICT, error);
    }
}