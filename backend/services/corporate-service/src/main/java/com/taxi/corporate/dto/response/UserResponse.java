package com.taxi.corporate.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserResponse {
    private Integer id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean isActive;
    private Set<RoleResponse> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}