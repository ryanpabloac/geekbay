package com.geekbay.demo.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthorizedOperationException extends BaseException {
    private static final String error = "forbidden:operation";
    public UnauthorizedOperationException(String message) {
        super(message, HttpStatus.FORBIDDEN, error);
    }
}
