package com.taxi.driver.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverBlockRequest {

    @NotNull(message = "Block status is required")
    private Boolean isBlocked;

    private String blockedDescription;
}