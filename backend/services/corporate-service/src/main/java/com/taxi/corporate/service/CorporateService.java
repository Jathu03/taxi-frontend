package com.taxi.corporate.service;

import com.taxi.corporate.client.UserServiceClient;
import com.taxi.corporate.client.VehicleServiceClient;
import com.taxi.corporate.dto.request.AssignCorporateUserRequest;
import com.taxi.corporate.dto.request.CreateCorporateRequest;
import com.taxi.corporate.dto.request.UpdateCorporateRequest;
import com.taxi.corporate.dto.request.UpdateCorporateUserRequest;
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
    private final UserServiceClient userServiceClient;
    private final VehicleServiceClient vehicleServiceClient;

    // ==================== HELPER MAPS ====================

    /**
     * Fetches ALL Master Vehicle Classes from Vehicle-Service.
     */
    private Map<Integer, VehicleClassResponse> fetchVehicleClassMap() {
        try {
            ApiResponse<List<VehicleClassResponse>> response = vehicleServiceClient.getAllVehicleClasses();
            if (response != null && response.getData() != null) {
                return response.getData().stream()
                        .collect(Collectors.toMap(
                                VehicleClassResponse::getId,
                                vc -> vc,
                                (a, b) -> a));
            }
        } catch (Exception e) {
            log.warn("Could not fetch vehicle classes: {}", e.getMessage());
        }
        return Collections.emptyMap();
    }

    private Map<Integer, UserResponse> fetchUserMap() {
        try {
            List<UserResponse> users = userServiceClient.getAllUsers();
            if (users != null) {
                return users.stream()
                        .collect(Collectors.toMap(
                                UserResponse::getId,
                                u -> u,
                                (a, b) -> a));
            }
        } catch (Exception e) {
            log.warn("Could not fetch users: {}", e.getMessage());
        }
        return Collections.emptyMap();
    }

    // ==================== CORPORATE CRUD ====================

    @Transactional
    public CorporateResponse createCorporate(CreateCorporateRequest request) {
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
        return convertToResponse(saved, fetchVehicleClassMap());
    }

    @Transactional(readOnly = true)
    public List<CorporateResponse> getAllCorporates() {
        Map<Integer, VehicleClassResponse> vcMap = fetchVehicleClassMap();
        return corporateRepository.findAll().stream()
                .map(c -> convertToResponse(c, vcMap))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CorporateResponse getCorporateById(Integer id) {
        Corporate corporate = corporateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Corporate not found: " + id));
        return convertToResponse(corporate, fetchVehicleClassMap());
    }

    @Transactional(readOnly = true)
    public List<CorporateResponse> searchCorporates(String searchTerm) {
        return corporateRepository.searchCorporates(searchTerm).stream()
                .map(c -> convertToResponse(c, fetchVehicleClassMap()))
                .collect(Collectors.toList());
    }

    @Transactional
    public CorporateResponse updateCorporate(Integer id, UpdateCorporateRequest request) {
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

        // Optional: Manual update of classes from the update form
        if (request.getVehicleClassIds() != null) {
            vehicleClassRepo.deleteByCorporateId(id);
            request.getVehicleClassIds().forEach(classId -> {
                CorporateVehicleClass cvc = new CorporateVehicleClass();
                cvc.setCorporate(corporate);
                cvc.setVehicleClassId(classId);
                cvc.setIsEnabled(true);
                vehicleClassRepo.save(cvc);
            });
        }

        return convertToResponse(corporate, fetchVehicleClassMap());
    }

    @Transactional
    public void deleteCorporate(Integer id) {
        if (!corporateRepository.existsById(id))
            throw new RuntimeException("Corporate not found: " + id);
        corporateUserRepository.deleteByCorporateId(id);
        vehicleClassRepo.deleteByCorporateId(id);
        corporateRepository.deleteById(id);
    }

    // ==================== CORPORATE USERS ====================

    @Transactional(readOnly = true)
    public List<UserResponse> getCorporateRoleUsers() {
        try {
            List<UserResponse> users = userServiceClient.getAllUsers();
            if (users == null)
                return Collections.emptyList();
            return users.stream()
                    .filter(u -> u.getRoles() != null
                            && u.getRoles().stream().anyMatch(r -> "Corporate".equalsIgnoreCase(r.getRoleName())))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @Transactional(readOnly = true)
    public List<CorporateUserResponse> getCorporateUsers(Integer corporateId) {
        Corporate corp = corporateRepository.findById(corporateId).orElseThrow(() -> new RuntimeException("Not found"));
        List<CorporateUser> list = corporateUserRepository.findByCorporateId(corporateId);
        Map<Integer, UserResponse> userMap = fetchUserMap();
        return list.stream().map(cu -> buildUserRes(cu, corp, userMap.get(cu.getUserId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CorporateUserResponse getSingleCorporateUser(Integer corporateId, Integer userId) {
        Corporate corp = corporateRepository.findById(corporateId).orElseThrow(() -> new RuntimeException("Not found"));
        CorporateUser cu = corporateUserRepository.findByCorporateIdAndUserId(corporateId, userId)
                .orElseThrow(() -> new RuntimeException("Not assigned"));
        UserResponse user = null;
        try {
            user = userServiceClient.getUserById(userId);
        } catch (Exception ignored) {
        }
        return buildUserRes(cu, corp, user);
    }

    @Transactional
    public CorporateUserResponse assignUserToCorporate(Integer corporateId, AssignCorporateUserRequest req) {
        Corporate corp = corporateRepository.findById(corporateId).orElseThrow(() -> new RuntimeException("Not found"));
        if (corporateUserRepository.existsByCorporateIdAndUserId(corporateId, req.getUserId()))
            throw new RuntimeException("Already assigned");
        CorporateUser cu = new CorporateUser();
        cu.setCorporate(corp);
        cu.setUserId(req.getUserId());
        cu.setDesignation(req.getDesignation());
        cu.setDepartment(req.getDepartment());
        cu.setCanBook(req.getCanBook());
        cu.setCanViewReports(req.getCanViewReports());
        // Fix for NullPointerException on isActive
        cu.setIsActive(true);
        corporateUserRepository.save(cu);
        UserResponse user = userServiceClient.getUserById(req.getUserId());
        return buildUserRes(cu, corp, user);
    }

    @Transactional
    public CorporateUserResponse updateCorporateUser(Integer cid, Integer uid, UpdateCorporateUserRequest req) {
        CorporateUser cu = corporateUserRepository.findByCorporateIdAndUserId(cid, uid)
                .orElseThrow(() -> new RuntimeException("Not assigned"));
        if (req.getDesignation() != null)
            cu.setDesignation(req.getDesignation());
        if (req.getDepartment() != null)
            cu.setDepartment(req.getDepartment());
        if (req.getIsActive() != null)
            cu.setIsActive(req.getIsActive());
        if (req.getCanBook() != null)
            cu.setCanBook(req.getCanBook());
        if (req.getCanViewReports() != null)
            cu.setCanViewReports(req.getCanViewReports());
        corporateUserRepository.save(cu);
        return getSingleCorporateUser(cid, uid);
    }

    @Transactional
    public CorporateUserResponse toggleCorporateUser(Integer cid, Integer uid) {
        CorporateUser cu = corporateUserRepository.findByCorporateIdAndUserId(cid, uid)
                .orElseThrow(() -> new RuntimeException("Not assigned"));
        cu.setIsActive(!cu.getIsActive());
        corporateUserRepository.save(cu);
        return getSingleCorporateUser(cid, uid);
    }

    @Transactional
    public void removeUserFromCorporate(Integer cid, Integer uid) {
        CorporateUser cu = corporateUserRepository.findByCorporateIdAndUserId(cid, uid)
                .orElseThrow(() -> new RuntimeException("Not assigned"));
        corporateUserRepository.delete(cu);
    }

    // ==================== VEHICLE CLASS TOGGLE ====================

    /**
     * Toggles class. Logic:
     * 1. If mapping exists -> flip enabled status.
     * 2. If mapping DOES NOT exist -> create it and set enabled = true.
     */
    @Transactional
    public CorporateVehicleClassResponse toggleVehicleClassForCorporate(
            Integer corporateId,
            Integer masterClassId // This is the ID from Vehicle-Service
    ) {
        log.info("Toggling master class {} for corporate {}", masterClassId, corporateId);

        Corporate corporate = corporateRepository.findById(corporateId)
                .orElseThrow(() -> new RuntimeException("Corporate not found: " + corporateId));

        // Find existing mapping or create empty
        CorporateVehicleClass cvc = vehicleClassRepo
                .findByCorporateId(corporateId).stream()
                .filter(c -> c.getVehicleClassId().equals(masterClassId))
                .findFirst()
                .orElse(new CorporateVehicleClass());

        if (cvc.getId() == null) {
            // NEW ASSIGNMENT
            cvc.setCorporate(corporate);
            cvc.setVehicleClassId(masterClassId);
            cvc.setIsEnabled(true);
            cvc.setCustomRate(null);
        } else {
            // UPDATE EXISTING
            cvc.setIsEnabled(!Boolean.TRUE.equals(cvc.getIsEnabled()));
        }

        CorporateVehicleClass saved = vehicleClassRepo.save(cvc);

        // Fetch details for display
        String className = "Unknown";
        String classCode = "N/A";
        try {
            ApiResponse<VehicleClassResponse> res = vehicleServiceClient.getVehicleClassById(masterClassId);
            if (res != null && res.getData() != null) {
                className = res.getData().getClassName();
                classCode = res.getData().getClassCode();
            }
        } catch (Exception ignored) {
        }

        return CorporateVehicleClassResponse.builder()
                .id(saved.getId())
                .vehicleClassId(saved.getVehicleClassId())
                .className(className)
                .classCode(classCode)
                .isEnabled(saved.getIsEnabled())
                .customRate(saved.getCustomRate())
                .build();
    }

    // ==================== HELPERS ====================

    private CorporateUserResponse buildUserRes(CorporateUser cu, Corporate corp, UserResponse u) {
        return CorporateUserResponse.builder()
                .id(cu.getId())
                .corporateId(corp.getId())
                .corporateName(corp.getName())
                .userId(cu.getUserId())
                .username(u != null ? u.getUsername() : "Unknown")
                .firstName(u != null ? u.getFirstName() : "User")
                .lastName(u != null ? u.getLastName() : "")
                .email(u != null ? u.getEmail() : "")
                .phoneNumber(u != null ? u.getPhoneNumber() : "")
                .designation(cu.getDesignation())
                .department(cu.getDepartment())
                .isActive(cu.getIsActive())
                .canBook(cu.getCanBook())
                .canViewReports(cu.getCanViewReports())
                .createdAt(cu.getCreatedAt())
                .build();
    }

    /**
     * Converts Corporate to Response.
     * CRITICAL FIX: Loops over ALL Master Vehicle Classes (vcMap) to ensure every
     * class appears.
     */
    private CorporateResponse convertToResponse(
            Corporate corporate,
            Map<Integer, VehicleClassResponse> vcMap) {

        // 1. Get existing mappings from DB for this corporate
        List<CorporateVehicleClass> dbMappings = vehicleClassRepo.findByCorporateId(corporate.getId());

        // 2. Index them by Master Class ID for fast lookup
        Map<Integer, CorporateVehicleClass> existingMap = dbMappings.stream()
                .collect(Collectors.toMap(
                        CorporateVehicleClass::getVehicleClassId,
                        m -> m,
                        (a, b) -> a));

        // 3. Iterate over ALL Master Vehicle Classes (vcMap.values())
        List<CorporateVehicleClassResponse> vehicleClasses = vcMap.values().stream()
                .map(master -> {
                    // Check if this master class is already in our DB for this corporate
                    CorporateVehicleClass existing = existingMap.get(master.getId());

                    // If existing is null, it means it's not assigned yet (effectively disabled)
                    boolean isEnabled = existing != null && Boolean.TRUE.equals(existing.getIsEnabled());
                    Integer mappingId = existing != null ? existing.getId() : null; // can be null
                    var customRate = existing != null ? existing.getCustomRate() : null;

                    return CorporateVehicleClassResponse.builder()
                            .id(mappingId)
                            .vehicleClassId(master.getId()) // Master ID (Essential for toggling)
                            .className(master.getClassName())
                            .classCode(master.getClassCode())
                            .isEnabled(isEnabled)
                            .customRate(customRate)
                            .build();
                })
                // Optional: Sort by class name for nicer UI
                .sorted(Comparator.comparing(CorporateVehicleClassResponse::getClassName))
                .collect(Collectors.toList());

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
                .vehicleClasses(vehicleClasses) // Now contains ALL classes
                .vehicleCategories(Collections.emptyList())
                .createdAt(corporate.getCreatedAt())
                .updatedAt(corporate.getUpdatedAt())
                .build();
    }
}