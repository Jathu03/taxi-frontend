package com.taxi.driver.client;

import com.taxi.driver.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for communicating with User Service
 * Used to fetch user details for driver assignment
 */
@FeignClient(name = "user-service", fallback = UserServiceClientFallback.class)
public interface UserServiceClient {

    /**
     * Get user by ID
     */
    @GetMapping("/api/users/{id}")
    UserResponse getUserById(@PathVariable("id") Integer id);

    /**
     * Get all users (for dropdown)
     */
    @GetMapping("/api/users")
    List<UserResponse> getAllUsers();
}