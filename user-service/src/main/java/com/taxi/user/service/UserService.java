package com.taxi.user.service;

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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taxi.user.client.NotificationServiceClient;
import com.taxi.user.dto.request.SendNotificationRequest;

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
    private final NotificationServiceClient notificationServiceClient;

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

        // Assign roles to user
        Set<UserRole> userRoles = new HashSet<>();
        for (Integer roleId : request.getRoleIds()) {
            Role role = roleService.getRoleById(roleId);
            UserRole userRole = new UserRole();
            userRole.setUser(savedUser);
            userRole.setRole(role);
            userRoles.add(userRole);
        }
        savedUser.setUserRoles(userRoles);

        // Save user with roles
        User finalUser = userRepository.save(savedUser);
        log.info("User created successfully with id: {}", finalUser.getId());

        // sendUserCreatedNotification(finalUser);
        return convertToUserResponse(finalUser);
    }

    /**
     * Get all users
     * Returns list of all users in the system
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        log.debug("Fetching all users");
        List<User> users = userRepository.findAll();
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
            users = userRepository.findByPhoneNumberContaining(searchTerm);
        } else {
            users = userRepository.searchUsers(searchTerm);
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

        // Check username uniqueness (excluding current user)
        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // Check email uniqueness (excluding current user)
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Check phone uniqueness (excluding current user)
        if (!user.getPhoneNumber().equals(request.getPhoneNumber()) &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists: " + request.getPhoneNumber());
        }

        // Update user fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        // Update roles - remove old roles and add new ones
        userRoleRepository.deleteByUserId(id);

        Set<UserRole> userRoles = new HashSet<>();
        for (Integer roleId : request.getRoleIds()) {
            Role role = roleService.getRoleById(roleId);
            UserRole userRole = new UserRole();
            userRole.setUser(user);
            userRole.setRole(role);
            userRoles.add(userRole);
        }
        user.setUserRoles(userRoles);

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully with id: {}", id);
        // sendUserUpdatedNotification(updatedUser);
        return convertToUserResponse(updatedUser);
    }

    /**
     * Reset user password
     * Validates password confirmation and updates password hash
     */
    @Transactional
    public void resetPassword(Integer id, ResetPasswordRequest request) {
        log.info("Resetting password for user id: {}", id);

        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        log.info("Password reset successfully for user id: {}", id);
    }

    /**
     * Delete user by ID
     * Cascade delete will remove associated user_roles entries
     */
    @Transactional
    public void deleteUser(Integer id) {
        log.info("Deleting user with id: {}", id);

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        // sendUserDeletedNotification(user);
        userRepository.deleteById(id);
        log.info("User deleted successfully with id: {}", id);
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
}