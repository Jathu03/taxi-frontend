package com.taxi.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for User response
 * Contains user information to be sent to client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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