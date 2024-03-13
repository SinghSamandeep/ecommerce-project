package com.example.ecommercewatch.exception;

import com.example.ecommercewatch.model.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse<Object>> handleExpiredJwtException(ExpiredJwtException ex) {
        logger.error("ExpiredJwtException caught: {}", ex.getMessage());
        ApiResponse<Object> apiResponse = new ApiResponse<>("TOKEN HAS EXPIRED", null, "FAILED");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(apiResponse);
    }
}
