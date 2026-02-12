package com.taxi.promo.service;

import com.taxi.promo.client.CorporateServiceClient;
import com.taxi.promo.client.VehicleServiceClient;
import com.taxi.promo.dto.request.CreatePromoCodeRequest;
import com.taxi.promo.dto.request.UpdatePromoCodeRequest;
import com.taxi.promo.dto.response.CorporateResponse;
import com.taxi.promo.dto.response.PromoCodeResponse;
import com.taxi.promo.dto.response.VehicleClassResponse;
import com.taxi.promo.entity.PromoCode;
import com.taxi.promo.entity.PromoCodeVehicleClass;
import com.taxi.promo.repository.PromoCodeRepository;
import com.taxi.promo.repository.PromoCodeVehicleClassRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service class for Promo Code operations
 * Handles business logic for promo code management
 * Communicates with Vehicle Service and Corporate Service for related data
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;
    private final PromoCodeVehicleClassRepository promoCodeVehicleClassRepository;
    private final VehicleServiceClient vehicleServiceClient;
    private final CorporateServiceClient corporateServiceClient;

    /**
     * Create a new promo code
     * Validates uniqueness of promo code
     */
    @Transactional
    public PromoCodeResponse createPromoCode(CreatePromoCodeRequest request) {
        log.info("Creating new promo code: {}", request.getCode());

        // Check for duplicate code
        if (promoCodeRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Promo code already exists: " + request.getCode());
        }

        // Verify corporate exists if provided
        if (request.getCorporateId() != null) {
            try {
                corporateServiceClient.getCorporateById(request.getCorporateId());
            } catch (Exception e) {
                throw new RuntimeException("Corporate not found with id: " + request.getCorporateId());
            }
        }

        PromoCode promoCode = new PromoCode();
        promoCode.setCode(request.getCode());
        promoCode.setName(request.getName());
        promoCode.setDescription(request.getDescription());
        promoCode.setDiscountType(request.getDiscountType());
        promoCode.setDiscountValue(request.getDiscountValue());
        promoCode.setMaxDiscountAmount(request.getMaxDiscountAmount());
        promoCode.setMinimumFare(request.getMinimumFare());
        promoCode.setStartDate(request.getStartDate());
        promoCode.setEndDate(request.getEndDate());
        promoCode.setMaxUsage(request.getMaxUsage());
        promoCode.setMaxUsagePerCustomer(request.getMaxUsagePerCustomer());
        promoCode.setIsFirstTimeOnly(request.getIsFirstTimeOnly());
        promoCode.setMinimumHireCount(request.getMinimumHireCount());
        promoCode.setMaxHireCount(request.getMaxHireCount());
        promoCode.setApplicableTo(request.getApplicableTo());
        promoCode.setCorporateId(request.getCorporateId());
        promoCode.setCreatedBy(request.getCreatedBy());
        promoCode.setIsActive(true);
        promoCode.setCurrentUsage(0);

        // Save promo code first
        PromoCode savedPromoCode = promoCodeRepository.save(promoCode);
        log.debug("Promo code saved with id: {}", savedPromoCode.getId());

        // Assign vehicle classes to promo code
        if (request.getVehicleClassIds() != null && !request.getVehicleClassIds().isEmpty()) {
            Set<PromoCodeVehicleClass> vehicleClasses = new HashSet<>();
            for (Integer vehicleClassId : request.getVehicleClassIds()) {
                // Verify vehicle class exists
                try {
                    vehicleServiceClient.getVehicleClassById(vehicleClassId);
                } catch (Exception e) {
                    throw new RuntimeException("Vehicle class not found with id: " + vehicleClassId);
                }

                PromoCodeVehicleClass pcvc = new PromoCodeVehicleClass();
                pcvc.setPromoCode(savedPromoCode);
                pcvc.setVehicleClassId(vehicleClassId);
                vehicleClasses.add(pcvc);
            }
            savedPromoCode.setVehicleClasses(vehicleClasses);
        }

        // Save promo code with vehicle classes
        PromoCode finalPromoCode = promoCodeRepository.save(savedPromoCode);
        log.info("Promo code created successfully with id: {}", finalPromoCode.getId());

        return convertToResponse(finalPromoCode);
    }

    /**
     * Get all promo codes
     */
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> getAllPromoCodes() {
        log.debug("Fetching all promo codes");
        List<PromoCode> promoCodes = promoCodeRepository.findAll();
        return promoCodes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get promo code by ID
     * Used by other services (e.g., Booking Service)
     */
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeById(Integer id) {
        log.debug("Fetching promo code with id: {}", id);
        PromoCode promoCode = findPromoCodeById(id);
        return convertToResponse(promoCode);
    }

    /**
     * Get promo code by code
     */
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeByCode(String code) {
        log.debug("Fetching promo code with code: {}", code);
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promo code not found: " + code));
        return convertToResponse(promoCode);
    }

    /**
     * Search promo codes based on filter type
     * filterType: "code", "description", or "class"
     */
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> searchPromoCodes(String filterType, String searchTerm) {
        log.debug("Searching promo codes with filterType: {} and searchTerm: {}", filterType, searchTerm);

        List<PromoCode> promoCodes;

        if (searchTerm != null && !searchTerm.trim().isEmpty() && filterType != null) {
            if ("code".equalsIgnoreCase(filterType)) {
                promoCodes = promoCodeRepository.searchByCode(searchTerm);
            } else if ("description".equalsIgnoreCase(filterType)) {
                promoCodes = promoCodeRepository.searchByDescription(searchTerm);
            } else if ("class".equalsIgnoreCase(filterType)) {
                // For class search, we need to fetch all and filter by vehicle class name
                // This requires calling Vehicle Service for each vehicle class
                promoCodes = promoCodeRepository.findAll();
                // Filter logic would be complex here - simplified for now
            } else {
                promoCodes = promoCodeRepository.searchPromoCodes(searchTerm);
            }
        } else {
            promoCodes = promoCodeRepository.findAll();
        }

        return promoCodes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update promo code
     */
    @Transactional
    public PromoCodeResponse updatePromoCode(Integer id, UpdatePromoCodeRequest request) {
        log.info("Updating promo code with id: {}", id);

        PromoCode promoCode = findPromoCodeById(id);

        // Check code uniqueness (excluding current promo code)
        if (!promoCode.getCode().equals(request.getCode()) &&
                promoCodeRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Promo code already exists: " + request.getCode());
        }

        // Verify corporate exists if provided
        if (request.getCorporateId() != null) {
            try {
                corporateServiceClient.getCorporateById(request.getCorporateId());
            } catch (Exception e) {
                throw new RuntimeException("Corporate not found with id: " + request.getCorporateId());
            }
        }

        promoCode.setCode(request.getCode());
        promoCode.setName(request.getName());
        promoCode.setDescription(request.getDescription());
        promoCode.setDiscountType(request.getDiscountType());
        promoCode.setDiscountValue(request.getDiscountValue());
        promoCode.setMaxDiscountAmount(request.getMaxDiscountAmount());
        promoCode.setMinimumFare(request.getMinimumFare());
        promoCode.setStartDate(request.getStartDate());
        promoCode.setEndDate(request.getEndDate());
        promoCode.setMaxUsage(request.getMaxUsage());
        promoCode.setMaxUsagePerCustomer(request.getMaxUsagePerCustomer());
        promoCode.setIsFirstTimeOnly(request.getIsFirstTimeOnly());
        promoCode.setMinimumHireCount(request.getMinimumHireCount());
        promoCode.setMaxHireCount(request.getMaxHireCount());
        promoCode.setApplicableTo(request.getApplicableTo());
        promoCode.setCorporateId(request.getCorporateId());

        if (request.getIsActive() != null) {
            promoCode.setIsActive(request.getIsActive());
        }

        // Update vehicle classes - remove old and add new
        if (request.getVehicleClassIds() != null) {
            promoCodeVehicleClassRepository.deleteByPromoCodeId(id);

            Set<PromoCodeVehicleClass> vehicleClasses = new HashSet<>();
            for (Integer vehicleClassId : request.getVehicleClassIds()) {
                // Verify vehicle class exists
                try {
                    vehicleServiceClient.getVehicleClassById(vehicleClassId);
                } catch (Exception e) {
                    throw new RuntimeException("Vehicle class not found with id: " + vehicleClassId);
                }

                PromoCodeVehicleClass pcvc = new PromoCodeVehicleClass();
                pcvc.setPromoCode(promoCode);
                pcvc.setVehicleClassId(vehicleClassId);
                vehicleClasses.add(pcvc);
            }
            promoCode.setVehicleClasses(vehicleClasses);
        }

        PromoCode updatedPromoCode = promoCodeRepository.save(promoCode);
        log.info("Promo code updated successfully with id: {}", id);

        return convertToResponse(updatedPromoCode);
    }

    /**
     * Delete promo code
     */
    @Transactional
    public void deletePromoCode(Integer id) {
        log.info("Deleting promo code with id: {}", id);

        if (!promoCodeRepository.existsById(id)) {
            throw new RuntimeException("Promo code not found with id: " + id);
        }

        promoCodeRepository.deleteById(id);
        log.info("Promo code deleted successfully with id: {}", id);
    }

    /**
     * Get all active promo codes
     * Used by Booking Service
     */
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> getActivePromoCodes() {
        log.debug("Fetching all active promo codes");
        List<PromoCode> promoCodes = promoCodeRepository.findByIsActiveTrue();
        return promoCodes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Internal method to find promo code by ID
     */
    private PromoCode findPromoCodeById(Integer id) {
        return promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promo code not found with id: " + id));
    }

    /**
     * Convert PromoCode entity to PromoCodeResponse DTO
     * Fetches vehicle class and corporate information from respective services
     */
    private PromoCodeResponse convertToResponse(PromoCode promoCode) {
        Set<VehicleClassResponse> vehicleClasses = new HashSet<>();

        // Fetch vehicle class details from Vehicle Service
        for (PromoCodeVehicleClass pcvc : promoCode.getVehicleClasses()) {
            try {
                VehicleClassResponse vehicleClass = vehicleServiceClient.getVehicleClassById(
                        pcvc.getVehicleClassId());
                vehicleClasses.add(vehicleClass);
            } catch (Exception e) {
                log.warn("Failed to fetch vehicle class details: {}", e.getMessage());
            }
        }

        PromoCodeResponse response = PromoCodeResponse.builder()
                .id(promoCode.getId())
                .code(promoCode.getCode())
                .name(promoCode.getName())
                .description(promoCode.getDescription())
                .vehicleClasses(vehicleClasses)
                .discountType(promoCode.getDiscountType())
                .discountValue(promoCode.getDiscountValue())
                .maxDiscountAmount(promoCode.getMaxDiscountAmount())
                .minimumFare(promoCode.getMinimumFare())
                .startDate(promoCode.getStartDate())
                .endDate(promoCode.getEndDate())
                .maxUsage(promoCode.getMaxUsage())
                .currentUsage(promoCode.getCurrentUsage())
                .maxUsagePerCustomer(promoCode.getMaxUsagePerCustomer())
                .isFirstTimeOnly(promoCode.getIsFirstTimeOnly())
                .minimumHireCount(promoCode.getMinimumHireCount())
                .maxHireCount(promoCode.getMaxHireCount())
                .applicableTo(promoCode.getApplicableTo())
                .corporateId(promoCode.getCorporateId())
                .isActive(promoCode.getIsActive())
                .createdBy(promoCode.getCreatedBy())
                .createdAt(promoCode.getCreatedAt())
                .updatedAt(promoCode.getUpdatedAt())
                .build();

        // Fetch corporate details from Corporate Service
        if (promoCode.getCorporateId() != null) {
            try {
                CorporateResponse corporate = corporateServiceClient.getCorporateById(
                        promoCode.getCorporateId());
                response.setCorporateName(corporate.getName());
            } catch (Exception e) {
                log.warn("Failed to fetch corporate details: {}", e.getMessage());
            }
        }

        return response;
    }
}