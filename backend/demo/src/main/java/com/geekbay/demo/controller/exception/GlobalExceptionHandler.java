package com.geekbay.demo.controller.exception;

import com.geekbay.demo.exceptions.BaseException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<StandardError> database(final BaseException e, final HttpServletRequest request) {
        final StandardError err =
                StandardError.builder()
                        .timestamp(Instant.now())
                        .status(e.getStatus().value())
                        .error(e.getError())
                        .message(e.getMessage())
                        .path(request.getRequestURI())
                        .build();

        return ResponseEntity.status(e.getStatus()).body(err);
    }
}