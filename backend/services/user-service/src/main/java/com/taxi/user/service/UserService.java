package com.taxi.user.service;

import com.taxi.user.dto.request.LoginRequest;
import com.taxi.user.dto.request.CreateUserRequest;
import com.taxi.user.dto.request.ResetPasswordRequest;
import com.taxi.user.dto.request.UpdateUserRequest;
import com.taxi.user.dto.response.RoleResponse;
import com.taxi.user.dto.response.UserResponse;
import com.taxi.user.entity.Role;
import com.taxi.user.entity.User;
import com.taxi.user.entity.UserRole;
import com.taxi.user.repository.UserRepository;
import com.taxi.user.repository.UserRoleRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taxi.user.client.MailServiceClient;
import com.taxi.user.dto.request.SendEmailRequest;
import java.util.HashMap;
import java.util.Map;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service class for User operations
 * Handles business logic for user management including CRUD operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleService roleService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final MailServiceClient mailServiceClient;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Authenticate user by username/email and password
     */
    public UserResponse authenticate(LoginRequest request) {
        log.info("Authenticating user: {}", request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Authentication failed for user: {} - Invalid password", request.getUsername());
            throw new RuntimeException("Invalid username or password");
        }

        if (!user.getIsActive()) {
            log.warn("Authentication failed for user: {} - Account is inactive", request.getUsername());
            throw new RuntimeException("Account is inactive");
        }

        log.info("User authenticated successfully: {}", request.getUsername());
        return convertToUserResponse(user);
    }

    /**
     * Create a new user with assigned roles
     * Validates uniqueness of username, email, and phone number
     * Hashes password before storing
     */
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating new user with username: {}", request.getUsername());

        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Check for duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Check for duplicate phone number
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists: " + request.getPhoneNumber());
        }

        // Create user entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);

        // Save user first
        User savedUser = userRepository.save(user);
        log.debug("User saved with id: {}", savedUser.getId());

        // Save roles SEPARATELY
        for (Integer roleId : request.getRoleIds()) {
            Role role = roleService.getRoleById(roleId);

            UserRole userRole = new UserRole();
            userRole.setUser(savedUser);
            userRole.setRole(role);

            userRoleRepository.save(userRole);
        }

        UserResponse response = convertToUserResponse(
                userRepository.findById(savedUser.getId()).get());

        // Send Notification
        sendAccountNotification(response, "USER_CREATED");

        return response;
    }

    /**
     * Get all users
     * Returns list of all users in the system
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        log.debug("Fetching all users with optimized roles");
        List<User> users = userRepository.findAllOptimized();
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Integer id) {
        log.debug("Fetching user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToUserResponse(user);
    }

    /**
     * Search users based on filter type
     * filterType: "phone" - searches by phone number only
     * filterType: "all" - searches across all fields
     */
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String filterType, String searchTerm) {
        log.debug("Searching users with filterType: {} and searchTerm: {}", filterType, searchTerm);

        List<User> users;
        if ("phone".equalsIgnoreCase(filterType)) {
            users = userRepository.findByPhoneNumberContainingOptimized(searchTerm);
        } else {
            users = userRepository.searchUsersOptimized(searchTerm);
        }

        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update existing user
     * Validates uniqueness of username, email, and phone for other users
     */
    @Transactional
    public UserResponse updateUser(Integer id, UpdateUserRequest request) {
        log.info("Updating user with id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Uniqueness checks
        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (!user.getPhoneNumber().equals(request.getPhoneNumber()) &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        // Update basic fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        // Save ONLY user fields (no cascade now, so roles are untouched)
        userRepository.save(user);

        // Handle roles separately
        userRoleRepository.deleteByUserId(id);

        Set<Integer> uniqueRoleIds = new HashSet<>(request.getRoleIds());
        for (Integer roleId : uniqueRoleIds) {
            Role role = roleService.getRoleById(roleId);

            UserRole userRole = new UserRole();
            userRole.setUser(user);
            userRole.setRole(role);

            userRoleRepository.save(userRole);
        }

        // Re-fetch to get clean data with updated roles
        User updatedUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("User updated successfully with id: {}", id);
        UserResponse response = convertToUserResponse(updatedUser);

        // Send Notification
        sendAccountNotification(response, "USER_UPDATED");

        return response;
    }

    /**
     * Delete user by ID
     * Cascade delete will remove associated user_roles entries
     */
    @Transactional
    public void deleteUser(Integer id) {
        log.info("Deleting user with id: {}", id);

        // 1. Fetch the user first (so you can send a notification if needed)
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // 2. CRITICAL: Manually delete the roles first
        // Since we removed Cascade from the Entity, we MUST do this here
        userRoleRepository.deleteByUserId(id);

        // 3. Now delete the user
        userRepository.deleteById(id);

        log.info("User deleted successfully with id: {}", id);

        // 4. Send notification
        try {
            UserResponse response = convertToUserResponse(user);
            sendAccountNotification(response, "USER_DELETED");
        } catch (Exception e) {
            log.warn("Failed to send user deletion notification: {}", e.getMessage());
        }
    }

    private void sendAccountNotification(UserResponse user, String templateCode) {
        log.info("Sending {} notification to user: {}", templateCode, user.getEmail());
        try {
            Map<String, String> vars = new HashMap<>();
            vars.put("firstName", user.getFirstName());
            vars.put("customerName", user.getFirstName()); // Alias for consistency with global templates
            vars.put("lastName", user.getLastName());
            vars.put("username", user.getUsername());
            vars.put("email", user.getEmail());

            SendEmailRequest notificationRequest = SendEmailRequest.builder()
                    .recipientEmail(user.getEmail())
                    .recipientName(user.getFirstName() + " " + user.getLastName())
                    .templateCode(templateCode)
                    .templateVariables(vars)
                    .build();

            mailServiceClient.sendEmail(notificationRequest);
        } catch (Exception e) {
            log.error("Failed to send {} notification: {}", templateCode, e.getMessage());
        }
    }

    /**
     * Convert User entity to UserResponse DTO
     * Includes role information
     */
    private UserResponse convertToUserResponse(User user) {
        Set<RoleResponse> roles = user.getUserRoles().stream()
                .map(userRole -> RoleResponse.builder()
                        .id(userRole.getRole().getId())
                        .roleName(userRole.getRole().getRoleName())
                        .description(userRole.getRole().getDescription())
                        .isActive(userRole.getRole().getIsActive())
                        .build())
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .isActive(user.getIsActive())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @Transactional
    public void resetPassword(Integer id, ResetPasswordRequest request) {
        log.info("Resetting password for user id: {}", id);

        // Security Check: Ensure passwords match (Defense against bypassing frontend)
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // CRITICAL: Encode the password before saving!
        // If you save plain text, Login will fail because Spring Security expects a
        // hash.
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        user.setPasswordHash(encodedPassword);

        userRepository.save(user);

        log.info("Password reset successfully for user id: {}", id);
    }
}