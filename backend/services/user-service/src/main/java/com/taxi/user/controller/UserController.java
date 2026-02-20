package com.taxi.user.controller;

import com.taxi.user.dto.request.ForgotPasswordRequest;
import com.taxi.user.dto.request.LoginRequest;
import com.taxi.user.dto.request.VerifyOtpRequest;
import com.taxi.user.dto.request.CreateUserRequest;
import com.taxi.user.dto.request.ResetPasswordRequest;
import com.taxi.user.dto.request.UpdateUserRequest;
import com.taxi.user.dto.response.UserResponse;
import com.taxi.user.service.UserService;
import com.taxi.user.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for User operations
 * Provides endpoints for user management (CRUD operations)
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    /**
     * POST /api/users/login
     * Authenticate user and return details
     */
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/users/login - Authenticating user: {}", request.getUsername());
        UserResponse response = userService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/users/forgot-password
     * Send OTP code to user's email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("RECEIVED /api/users/forgot-password for: {}", request.getEmail());
        passwordResetService.generateAndSendOtp(request);
        log.info("COMPLETED /api/users/forgot-password for: {}", request.getEmail());
        return ResponseEntity.ok(Map.of("message", "OTP handled for " + request.getEmail()));
    }

    /**
     * POST /api/users/verify-otp
     * Verify OTP and return userId for reset-password redirect
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("RECEIVED /api/users/verify-otp for: {}", request.getEmail());
        Integer userId = passwordResetService.verifyOtp(request);
        log.info("SUCCESSFUL /api/users/verify-otp for: {}, userId: {}", request.getEmail(), userId);
        return ResponseEntity.ok(Map.of("userId", userId, "message", "OTP verified successfully"));
    }

    /**
     * POST /api/users
     * Create a new user
     * Request body: CreateUserRequest with user details and role IDs
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("POST /api/users - Creating new user: {}", request.getUsername());
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/users
     * Get all users or search users based on filter
     * Query params:
     * - filterType: "phone" or "all" (optional)
     * - searchTerm: search string (optional)
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String searchTerm) {

        log.info("GET /api/users - filterType: {}, searchTerm: {}", filterType, searchTerm);

        List<UserResponse> users;
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            users = userService.searchUsers(filterType, searchTerm);
        } else {
            users = userService.getAllUsers();
        }

        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/users/{id}
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer id) {
        log.info("GET /api/users/{} - Fetching user", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * PUT /api/users/{id}
     * Update existing user
     * Request body: UpdateUserRequest with updated user details
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request) {

        log.info("PUT /api/users/{} - Updating user", id);
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/users/{id}/reset-password
     * Reset user password
     * Request body: ResetPasswordRequest with new password
     */

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(

            @PathVariable Integer id,

            @Valid @RequestBody ResetPasswordRequest request) {

        log.info("PUT /api/users/{}/reset-password - Resetting password", id);
        userService.resetPassword(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/users/{id}
     * Delete user by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        log.info("DELETE /api/users/{} - Deleting user", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}