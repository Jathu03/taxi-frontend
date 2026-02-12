package com.taxi.promo.client;

import com.taxi.promo.dto.response.CorporateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for communicating with Corporate Service
 * Used to fetch corporate details
 * NO FALLBACK - Will throw exception if Corporate Service is unavailable
 */
@FeignClient(name = "corporate-service", url = "${service.urls.corporate-service}")
public interface CorporateServiceClient {

    /**
     * Get corporate by ID
     */
    @GetMapping("/api/corporates/{id}")
    CorporateResponse getCorporateById(@PathVariable("id") Integer id);

    /**
     * Get all corporates (for dropdown)
     */
    @GetMapping("/api/corporates")
    List<CorporateResponse> getAllCorporates();
}