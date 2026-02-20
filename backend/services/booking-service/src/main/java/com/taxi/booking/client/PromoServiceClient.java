package com.taxi.booking.client;

import com.taxi.booking.dto.response.ApiResponse;
import com.taxi.booking.dto.response.PromoCodeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for communicating with Fare-Promo Service
 */
@FeignClient(name = "fare-promo-service", contextId = "promoServiceClient")
public interface PromoServiceClient {
    @GetMapping("/api/promo-codes/{id}")
    PromoCodeResponse getPromoCodeById(@PathVariable("id") Integer id);

    @GetMapping("/api/promo-codes/code/{code}")
    PromoCodeResponse getPromoCodeByCode(@PathVariable("code") String code);
}