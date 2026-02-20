package com.taxi.driver.dto.external;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ExternalApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private int statusCode;
    private LocalDateTime timestamp;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;
}
