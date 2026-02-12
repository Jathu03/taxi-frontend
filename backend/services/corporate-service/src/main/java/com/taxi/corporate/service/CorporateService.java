package com.taxi.corporate.service;

import com.taxi.corporate.client.UserServiceClient;
import com.taxi.corporate.client.VehicleServiceClient;
import com.taxi.corporate.dto.request.*;
import com.taxi.corporate.dto.response.*;
import com.taxi.corporate.entity.*;
import com.taxi.corporate.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CorporateService {

    private final CorporateRepository corporateRepository;
    private final CorporateUserRepository corporateUserRepository;
    private final CorporateVehicleClassRepository vehicleClassRepo;
    private final CorporateVehicleCategoryRepository vehicleCategoryRepo;
    private final UserServiceClient userServiceClient;
    private final VehicleServiceClient vehicleServiceClient;

    // ==================== CORPORATE CRUD ====================

    @Transactional
    public CorporateResponse createCorporate(CreateCorporateRequest request) {
        log.info("Creating corporate: {}", request.getCode());

        if (corporateRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Corporate code already exists: " + request.getCode());
        }
        if (corporateRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        Corporate corporate = new Corporate();
        corporate.setName(request.getName());
        corporate.setCode(request.getCode());
        corporate.setPrimaryContact(request.getPrimaryContact());
        corporate.setPhone(request.getPhone());
        corporate.setEmail(request.getEmail());
        corporate.setAddress(request.getAddress());
        corporate.setRegistrationDate(request.getRegistrationDate());

        if (request.getBillingType() != null)
            corporate.setBillingType(request.getBillingType());
        if (request.getCreditLimit() != null)
            corporate.setCreditLimit(request.getCreditLimit());
        if (request.getCashDiscountRate() != null)
            corporate.setCashDiscountRate(request.getCashDiscountRate());
        if (request.getCreditDiscountRate() != null)
            corporate.setCreditDiscountRate(request.getCreditDiscountRate());
        if (request.getEnableQuickBooking() != null)
            corporate.setEnableQuickBooking(request.getEnableQuickBooking());
        if (request.getRequireVoucher() != null)
            corporate.setRequireVoucher(request.getRequireVoucher());
        if (request.getRequireCostCenter() != null)
            corporate.setRequireCostCenter(request.getRequireCostCenter());

        Corporate saved = corporateRepository.save(corporate);

        // Save vehicle classes
        /*
         * if (request.getVehicleClassIds() != null) {
         * for (Integer classId : request.getVehicleClassIds()) {
         * CorporateVehicleClass cvc = new CorporateVehicleClass();
         * cvc.setCorporate(saved);
         * cvc.setVehicleClassId(classId);
         * vehicleClassRepo.save(cvc);
         * }
         * }
         * 
         * // Save vehicle categories
         * if (request.getVehicleCategoryIds() != null) {
         * for (Integer catId : request.getVehicleCategoryIds()) {
         * CorporateVehicleCategory cvcat = new CorporateVehicleCategory();
         * cvcat.setCorporate(saved);
         * cvcat.setVehicleCategoryId(catId);
         * vehicleCategoryRepo.save(cvcat);
         * }
         * }
         */

        log.info("Corporate created with id: {}", saved.getId());
        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CorporateResponse> getAllCorporates() {
        return corporateRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CorporateResponse getCorporateById(Integer id) {
        Corporate corporate = corporateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Corporate not found: " + id));
        return convertToResponse(corporate);
    }

    @Transactional(readOnly = true)
    public List<CorporateResponse> searchCorporates(String searchTerm) {
        return corporateRepository.searchCorporates(searchTerm).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CorporateResponse updateCorporate(Integer id, UpdateCorporateRequest request) {
        log.info("Updating corporate: {}", id);

        Corporate corporate = corporateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Corporate not found: " + id));

        corporate.setName(request.getName());
        corporate.setPrimaryContact(request.getPrimaryContact());
        corporate.setPhone(request.getPhone());
        corporate.setEmail(request.getEmail());
        corporate.setAddress(request.getAddress());
        corporate.setRegistrationDate(request.getRegistrationDate());

        if (request.getBillingType() != null)
            corporate.setBillingType(request.getBillingType());
        if (request.getCreditLimit() != null)
            corporate.setCreditLimit(request.getCreditLimit());
        if (request.getCashDiscountRate() != null)
            corporate.setCashDiscountRate(request.getCashDiscountRate());
        if (request.getCreditDiscountRate() != null)
            corporate.setCreditDiscountRate(request.getCreditDiscountRate());
        if (request.getEnableQuickBooking() != null)
            corporate.setEnableQuickBooking(request.getEnableQuickBooking());
        if (request.getRequireVoucher() != null)
            corporate.setRequireVoucher(request.getRequireVoucher());
        if (request.getRequireCostCenter() != null)
            corporate.setRequireCostCenter(request.getRequireCostCenter());
        if (request.getIsActive() != null)
            corporate.setIsActive(request.getIsActive());

        corporateRepository.save(corporate);

        // Update vehicle classes
        if (request.getVehicleClassIds() != null) {
            vehicleClassRepo.deleteByCorporateId(id);
            for (Integer classId : new HashSet<>(request.getVehicleClassIds())) {
                CorporateVehicleClass cvc = new CorporateVehicleClass();
                cvc.setCorporate(corporate);
                cvc.setVehicleClassId(classId);
                vehicleClassRepo.save(cvc);
            }
        }

        // Update vehicle categories
        if (request.getVehicleCategoryIds() != null) {
            vehicleCategoryRepo.deleteByCorporateId(id);
            for (Integer catId : new HashSet<>(request.getVehicleCategoryIds())) {
                CorporateVehicleCategory cvcat = new CorporateVehicleCategory();
                cvcat.setCorporate(corporate);
                cvcat.setVehicleCategoryId(catId);
                vehicleCategoryRepo.save(cvcat);
            }
        }

        return convertToResponse(corporate);
    }

    @Transactional
    public void deleteCorporate(Integer id) {
        log.info("Deleting corporate: {}", id);

        if (!corporateRepository.existsById(id)) {
            throw new RuntimeException("Corporate not found: " + id);
        }

        corporateUserRepository.deleteByCorporateId(id);
        vehicleClassRepo.deleteByCorporateId(id);
        vehicleCategoryRepo.deleteByCorporateId(id);
        corporateRepository.deleteById(id);

        log.info("Corporate deleted: {}", id);
    }

    // ==================== CORPORATE USERS ====================

    /**
     * Get all users with "Corporate" role from User-Service
     * These are users AVAILABLE to be assigned to any corporate
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getCorporateRoleUsers() {
        log.info("Fetching users with Corporate role from User-Service");

        List<UserResponse> allUsers = userServiceClient.getAllUsers();

        // Filter users who have the "Corporate" role
        return allUsers.stream()
                .filter(user -> user.getRoles() != null &&
                        user.getRoles().stream()
                                .anyMatch(role -> "Corporate".equalsIgnoreCase(role.getRoleName())))
                .collect(Collectors.toList());
    }

    /**
     * Get users assigned to a specific corporate
     */
    @Transactional(readOnly = true)
    public List<CorporateUserResponse> getCorporateUsers(Integer corporateId) {
        log.info("Fetching users for corporate: {}", corporateId);

        Corporate corporate = corporateRepository.findById(corporateId)
                .orElseThrow(() -> new RuntimeException("Corporate not found: " + corporateId));

        List<CorporateUser> corporateUsers = corporateUserRepository.findByCorporateId(corporateId);

        return corporateUsers.stream().map(cu -> {
            CorporateUserResponse.CorporateUserResponseBuilder builder = CorporateUserResponse.builder()
                    .id(cu.getId())
                    .corporateId(corporateId)
                    .corporateName(corporate.getName())
                    .userId(cu.getUserId())
                    .designation(cu.getDesignation())
                    .department(cu.getDepartment())
                    .canBook(cu.getCanBook())
                    .canViewReports(cu.getCanViewReports())
                    .isActive(cu.getIsActive())
                    .createdAt(cu.getCreatedAt());

            // Fetch user details from User-Service
            try {
                UserResponse user = userServiceClient.getUserById(cu.getUserId());
                builder.username(user.getUsername())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber());
            } catch (Exception e) {
                log.warn("Could not fetch user details for userId: {}", cu.getUserId());
                builder.username("Unknown")
                        .firstName("User")
                        .lastName("#" + cu.getUserId());
            }

            return builder.build();
        }).collect(Collectors.toList());
    }

    /**
     * Assign a user to a corporate
     */
    @Transactional
    public CorporateUserResponse assignUserToCorporate(Integer corporateId, AssignCorporateUserRequest request) {
        log.info("Assigning user {} to corporate {}", request.getUserId(), corporateId);

        Corporate corporate = corporateRepository.findById(corporateId)
                .orElseThrow(() -> new RuntimeException("Corporate not found: " + corporateId));

        if (corporateUserRepository.existsByCorporateIdAndUserId(corporateId, request.getUserId())) {
            throw new RuntimeException("User is already assigned to this corporate");
        }

        // Verify user exists in User-Service
        UserResponse user;
        try {
            user = userServiceClient.getUserById(request.getUserId());
        } catch (Exception e) {
            throw new RuntimeException("User not found in User-Service: " + request.getUserId());
        }

        CorporateUser cu = new CorporateUser();
        cu.setCorporate(corporate);
        cu.setUserId(request.getUserId());
        cu.setDesignation(request.getDesignation());
        cu.setDepartment(request.getDepartment());
        cu.setCanBook(request.getCanBook() != null ? request.getCanBook() : true);
        cu.setCanViewReports(request.getCanViewReports() != null ? request.getCanViewReports() : false);

        CorporateUser saved = corporateUserRepository.save(cu);

        return CorporateUserResponse.builder()
                .id(saved.getId())
                .corporateId(corporateId)
                .corporateName(corporate.getName())
                .userId(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .designation(saved.getDesignation())
                .department(saved.getDepartment())
                .canBook(saved.getCanBook())
                .canViewReports(saved.getCanViewReports())
                .isActive(saved.getIsActive())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    /**
     * Toggle user active/inactive in a corporate
     */
    @Transactional
    public CorporateUserResponse toggleCorporateUser(Integer corporateId, Integer userId) {
        log.info("Toggling user {} in corporate {}", userId, corporateId);

        CorporateUser cu = corporateUserRepository.findByCorporateIdAndUserId(corporateId, userId)
                .orElseThrow(() -> new RuntimeException("User not assigned to this corporate"));

        cu.setIsActive(!cu.getIsActive());
        corporateUserRepository.save(cu);

        return getCorporateUsers(corporateId).stream()
                .filter(r -> r.getUserId().equals(userId))
                .findFirst()
                .orElseThrow();
    }

    /**
     * Remove user from a corporate
     */
    @Transactional
    public void removeUserFromCorporate(Integer corporateId, Integer userId) {
        log.info("Removing user {} from corporate {}", userId, corporateId);

        CorporateUser cu = corporateUserRepository.findByCorporateIdAndUserId(corporateId, userId)
                .orElseThrow(() -> new RuntimeException("User not assigned to this corporate"));

        corporateUserRepository.delete(cu);
    }

    // ==================== HELPER ====================

    private CorporateResponse convertToResponse(Corporate corporate) {
        // Get vehicle classes for this corporate
        List<CorporateVehicleClassResponse> vcResponses = vehicleClassRepo
                .findByCorporateId(corporate.getId()).stream()
                .map(cvc -> {
                    CorporateVehicleClassResponse.CorporateVehicleClassResponseBuilder builder = CorporateVehicleClassResponse
                            .builder()
                            .id(cvc.getId())
                            .vehicleClassId(cvc.getVehicleClassId())
                            .isEnabled(cvc.getIsEnabled())
                            .customRate(cvc.getCustomRate());

                    try {
                        VehicleClassResponse vc = vehicleServiceClient.getVehicleClassById(cvc.getVehicleClassId());
                        builder.className(vc.getClassName()).classCode(vc.getClassCode());
                    } catch (Exception e) {
                        builder.className("Unknown").classCode("N/A");
                    }

                    return builder.build();
                }).collect(Collectors.toList());

        // Get vehicle categories for this corporate
        List<CorporateVehicleCategoryResponse> vcatResponses = vehicleCategoryRepo
                .findByCorporateId(corporate.getId()).stream()
                .map(cvcat -> {
                    CorporateVehicleCategoryResponse.CorporateVehicleCategoryResponseBuilder builder = CorporateVehicleCategoryResponse
                            .builder()
                            .id(cvcat.getId())
                            .vehicleCategoryId(cvcat.getVehicleCategoryId())
                            .isEnabled(cvcat.getIsEnabled());

                    try {
                        VehicleCategoryResponse vcat = vehicleServiceClient
                                .getVehicleCategoryById(cvcat.getVehicleCategoryId());
                        builder.categoryName(vcat.getCategoryName());
                    } catch (Exception e) {
                        builder.categoryName("Unknown");
                    }

                    return builder.build();
                }).collect(Collectors.toList());

        return CorporateResponse.builder()
                .id(corporate.getId())
                .name(corporate.getName())
                .code(corporate.getCode())
                .primaryContact(corporate.getPrimaryContact())
                .phone(corporate.getPhone())
                .email(corporate.getEmail())
                .address(corporate.getAddress())
                .registrationDate(corporate.getRegistrationDate())
                .billingType(corporate.getBillingType())
                .creditLimit(corporate.getCreditLimit())
                .currentBalance(corporate.getCurrentBalance())
                .cashDiscountRate(corporate.getCashDiscountRate())
                .creditDiscountRate(corporate.getCreditDiscountRate())
                .enableQuickBooking(corporate.getEnableQuickBooking())
                .requireVoucher(corporate.getRequireVoucher())
                .requireCostCenter(corporate.getRequireCostCenter())
                .isActive(corporate.getIsActive())
                .vehicleClasses(vcResponses)
                .vehicleCategories(vcatResponses)
                .createdAt(corporate.getCreatedAt())
                .updatedAt(corporate.getUpdatedAt())
                .build();
    }
}