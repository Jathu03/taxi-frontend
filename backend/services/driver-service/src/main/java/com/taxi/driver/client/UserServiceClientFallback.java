package com.taxi.driver.client;

import com.taxi.driver.dto.response.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Fallback implementation for User Service Client
 * Returns default values when User Service is unavailable
 */
@Component
@Slf4j
public class UserServiceClientFallback implements UserServiceClient {

    @Override
    public UserResponse getUserById(Integer id) {
        log.warn("User Service unavailable, returning fallback for user id: {}", id);
        return UserResponse.builder()
                .id(id)
                .username("Unknown")
                .build();
    }

    @Override
    public List<UserResponse> getAllUsers() {
        log.warn("User Service unavailable, returning empty list for users");
        return new ArrayList<>();
    }
}