package com.geekbay.demo.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class BaseException extends RuntimeException {

    private final HttpStatus status;
    private final String error;

    protected BaseException(final String message, final HttpStatus status, final String error) {
        super(message);
        this.status = status;
        this.error = error;
    }
}