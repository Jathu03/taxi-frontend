package com.taxi.booking.client;

import com.taxi.booking.dto.response.ApiResponse;
import com.taxi.booking.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for communicating with User Service
 */
@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/api/users/{id}")
    UserResponse getUserById(@PathVariable("id") Integer id);
}