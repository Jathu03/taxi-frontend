package com.taxi.corporate.client;

import com.taxi.corporate.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    // Get all users (we will filter by "Corporate" role on the frontend or here)
    @GetMapping("/api/users")
    List<UserResponse> getAllUsers();

    // Get a specific user by ID
    @GetMapping("/api/users/{id}")
    UserResponse getUserById(@PathVariable("id") Integer id);
}