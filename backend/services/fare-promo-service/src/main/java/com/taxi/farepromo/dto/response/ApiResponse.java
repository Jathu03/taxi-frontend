package com.taxi.farepromo.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private int statusCode;
    private LocalDateTime timestamp;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true).message(message).data(data)
                .statusCode(200).timestamp(LocalDateTime.now()).build();
    }

    public static <T> ApiResponse<T> created(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true).message(message).data(data)
                .statusCode(201).timestamp(LocalDateTime.now()).build();
    }

    public static <T> ApiResponse<T> error(String message, int statusCode) {
        return ApiResponse.<T>builder()
                .success(false).message(message)
                .statusCode(statusCode).timestamp(LocalDateTime.now()).build();
    }

    public static <T> ApiResponse<T> paginated(T data, String message,
            long totalElements, int totalPages, int currentPage) {
        return ApiResponse.<T>builder()
                .success(true).message(message).data(data).statusCode(200)
                .timestamp(LocalDateTime.now()).totalElements(totalElements)
                .totalPages(totalPages).currentPage(currentPage).build();
    }
}