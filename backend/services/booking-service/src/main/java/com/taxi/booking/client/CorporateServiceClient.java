package com.taxi.booking.client;

import com.taxi.booking.dto.response.ApiResponse;
import com.taxi.booking.dto.response.CorporateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for communicating with Corporate Service
 */
@FeignClient(name = "corporate-service")
public interface CorporateServiceClient {
    @GetMapping("/api/corporates/{id}")
    CorporateResponse getCorporateById(@PathVariable("id") Integer id);

    @GetMapping("/api/corporates")
    List<CorporateResponse> getAllCorporates();
}