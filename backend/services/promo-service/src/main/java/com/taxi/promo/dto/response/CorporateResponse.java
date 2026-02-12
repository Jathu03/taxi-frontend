package com.taxi.promo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Corporate response from Corporate Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorporateResponse {

    private Integer id;
    private String name;
    private String code;
}