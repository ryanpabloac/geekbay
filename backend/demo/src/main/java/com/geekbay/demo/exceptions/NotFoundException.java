package com.geekbay.demo.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseException {

    private static final String error = "data:not_found";

    public NotFoundException(final String message) {
        super(message, HttpStatus.NOT_FOUND, error);
    }
}