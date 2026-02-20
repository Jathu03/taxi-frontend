package com.taxi.corporate.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data; // This holds the actual List or Object
    private int statusCode;
    private LocalDateTime timestamp;
}