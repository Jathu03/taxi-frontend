package com.taxi.farepromo.service;

import com.taxi.farepromo.dto.request.PromoCodeCreateRequest;
import com.taxi.farepromo.dto.request.PromoCodeUpdateRequest;
import com.taxi.farepromo.dto.request.PromoCodeUsageRequest;
import com.taxi.farepromo.dto.response.PromoCodeResponse;
import com.taxi.farepromo.dto.response.PromoCodeUsageResponse;
import com.taxi.farepromo.entity.PromoCode;
import com.taxi.farepromo.entity.PromoCodeUsage;
import com.taxi.farepromo.entity.PromoCodeVehicleClass;
import com.taxi.farepromo.repository.PromoCodeRepository;
import com.taxi.farepromo.repository.PromoCodeUsageRepository;
import com.taxi.farepromo.repository.PromoCodeVehicleClassRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;
    private final PromoCodeVehicleClassRepository vehicleClassRepository;
    private final PromoCodeUsageRepository usageRepository;

    @Override
    public PromoCodeResponse createPromoCode(PromoCodeCreateRequest request) {
        log.info("Creating promo code: {}", request.getCode());

        if (promoCodeRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Promo code already exists: " + request.getCode());
        }

        PromoCode promoCode = PromoCode.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .minimumFare(request.getMinimumFare())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .maxUsage(request.getMaxUsage())
                .maxUsagePerCustomer(request.getMaxUsagePerCustomer())
                .isFirstTimeOnly(request.getIsFirstTimeOnly())
                .minimumHireCount(request.getMinimumHireCount())
                .maxHireCount(request.getMaxHireCount())
                .applicableTo(request.getApplicableTo())
                .corporateId(request.getCorporateId())
                .isActive(request.getIsActive())
                .createdBy(request.getCreatedBy())
                .build();

        PromoCode saved = promoCodeRepository.save(promoCode);

        // Save vehicle class associations
        if (request.getVehicleClassIds() != null && !request.getVehicleClassIds().isEmpty()) {
            List<PromoCodeVehicleClass> associations = request.getVehicleClassIds().stream()
                    .map(classId -> PromoCodeVehicleClass.builder()
                            .promoCode(saved)
                            .vehicleClassId(classId)
                            .build())
                    .collect(Collectors.toList());
            vehicleClassRepository.saveAll(associations);
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeById(Integer id) {
        return mapToResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeByCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Promo code not found: " + code));
        return mapToResponse(promoCode);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PromoCodeResponse> getAllPromoCodes(Pageable pageable) {
        return promoCodeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PromoCodeResponse> searchPromoCodes(String search, Boolean isActive, Pageable pageable) {
        if (isActive != null) {
            return promoCodeRepository.searchPromoCodesWithFilter(search, isActive, pageable)
                    .map(this::mapToResponse);
        }
        return promoCodeRepository.searchPromoCodes(search, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> getActivePromoCodes() {
        return promoCodeRepository.findByIsActiveTrue()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> getValidPromoCodes() {
        return promoCodeRepository.findCurrentlyValidPromos(LocalDateTime.now())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PromoCodeResponse updatePromoCode(Integer id, PromoCodeUpdateRequest request) {
        PromoCode promoCode = findOrThrow(id);

        if (request.getCode() != null &&
                !request.getCode().equals(promoCode.getCode()) &&
                promoCodeRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Promo code already exists: " + request.getCode());
        }

        if (request.getCode() != null)
            promoCode.setCode(request.getCode());
        if (request.getName() != null)
            promoCode.setName(request.getName());
        if (request.getDescription() != null)
            promoCode.setDescription(request.getDescription());
        if (request.getDiscountType() != null)
            promoCode.setDiscountType(request.getDiscountType());
        if (request.getDiscountValue() != null)
            promoCode.setDiscountValue(request.getDiscountValue());
        if (request.getMaxDiscountAmount() != null)
            promoCode.setMaxDiscountAmount(request.getMaxDiscountAmount());
        if (request.getMinimumFare() != null)
            promoCode.setMinimumFare(request.getMinimumFare());
        if (request.getStartDate() != null)
            promoCode.setStartDate(request.getStartDate());
        if (request.getEndDate() != null)
            promoCode.setEndDate(request.getEndDate());
        if (request.getMaxUsage() != null)
            promoCode.setMaxUsage(request.getMaxUsage());
        if (request.getMaxUsagePerCustomer() != null)
            promoCode.setMaxUsagePerCustomer(request.getMaxUsagePerCustomer());
        if (request.getIsFirstTimeOnly() != null)
            promoCode.setIsFirstTimeOnly(request.getIsFirstTimeOnly());
        if (request.getMinimumHireCount() != null)
            promoCode.setMinimumHireCount(request.getMinimumHireCount());
        if (request.getMaxHireCount() != null)
            promoCode.setMaxHireCount(request.getMaxHireCount());
        if (request.getApplicableTo() != null)
            promoCode.setApplicableTo(request.getApplicableTo());
        if (request.getCorporateId() != null)
            promoCode.setCorporateId(request.getCorporateId());
        if (request.getIsActive() != null)
            promoCode.setIsActive(request.getIsActive());

        // Update vehicle class associations
        if (request.getVehicleClassIds() != null) {
            vehicleClassRepository.deleteByPromoCodeId(id);

            if (!request.getVehicleClassIds().isEmpty()) {
                List<PromoCodeVehicleClass> associations = request.getVehicleClassIds().stream()
                        .map(classId -> PromoCodeVehicleClass.builder()
                                .promoCode(promoCode)
                                .vehicleClassId(classId)
                                .build())
                        .collect(Collectors.toList());
                vehicleClassRepository.saveAll(associations);
            }
        }

        return mapToResponse(promoCodeRepository.save(promoCode));
    }

    @Override
    public void deletePromoCode(Integer id) {
        PromoCode promoCode = findOrThrow(id);
        promoCodeRepository.delete(promoCode);
    }

    @Override
    public PromoCodeResponse togglePromoCodeStatus(Integer id) {
        PromoCode promoCode = findOrThrow(id);
        promoCode.setIsActive(!promoCode.getIsActive());
        return mapToResponse(promoCodeRepository.save(promoCode));
    }

    // ========== Usage ==========

    @Override
    public PromoCodeUsageResponse recordUsage(PromoCodeUsageRequest request) {
        PromoCode promoCode = findOrThrow(request.getPromoCodeId());

        // Validate usage limits
        if (promoCode.getMaxUsage() > 0 && promoCode.getCurrentUsage() >= promoCode.getMaxUsage()) {
            throw new IllegalArgumentException("Promo code has reached maximum usage limit");
        }

        if (promoCode.getMaxUsagePerCustomer() > 0) {
            long customerUsage = usageRepository.countByPromoCodeIdAndContactNumber(
                    promoCode.getId(), request.getContactNumber());
            if (customerUsage >= promoCode.getMaxUsagePerCustomer()) {
                throw new IllegalArgumentException("Customer has reached maximum usage for this promo code");
            }
        }

        // Record usage
        PromoCodeUsage usage = PromoCodeUsage.builder()
                .promoCode(promoCode)
                .contactNumber(request.getContactNumber())
                .bookingId(request.getBookingId())
                .discountApplied(request.getDiscountApplied())
                .build();

        PromoCodeUsage saved = usageRepository.save(usage);

        // Increment usage counter
        promoCode.setCurrentUsage(promoCode.getCurrentUsage() + 1);
        promoCodeRepository.save(promoCode);

        return mapUsageToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PromoCodeUsageResponse> getUsageByPromoCode(Integer promoCodeId, Pageable pageable) {
        findOrThrow(promoCodeId);
        return usageRepository.findByPromoCodeId(promoCodeId, pageable).map(this::mapUsageToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PromoCodeResponse validatePromoCode(String code, String contactNumber, Integer vehicleClassId) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Invalid promo code: " + code));

        // Check if active
        if (!promoCode.getIsActive()) {
            throw new IllegalArgumentException("Promo code is inactive");
        }

        // Check date validity
        LocalDateTime now = LocalDateTime.now();
        if (promoCode.getStartDate() != null && now.isBefore(promoCode.getStartDate())) {
            throw new IllegalArgumentException("Promo code is not yet valid");
        }
        if (promoCode.getEndDate() != null && now.isAfter(promoCode.getEndDate())) {
            throw new IllegalArgumentException("Promo code has expired");
        }

        // Check global usage limit
        if (promoCode.getMaxUsage() > 0 && promoCode.getCurrentUsage() >= promoCode.getMaxUsage()) {
            throw new IllegalArgumentException("Promo code has reached maximum usage");
        }

        // Check per-customer usage limit
        if (promoCode.getMaxUsagePerCustomer() > 0 && contactNumber != null) {
            long customerUsage = usageRepository.countByPromoCodeIdAndContactNumber(
                    promoCode.getId(), contactNumber);
            if (customerUsage >= promoCode.getMaxUsagePerCustomer()) {
                throw new IllegalArgumentException("You have already used this promo code the maximum number of times");
            }
        }

        // Check vehicle class restriction
        if (vehicleClassId != null) {
            List<PromoCodeVehicleClass> classRestrictions = vehicleClassRepository.findByPromoCodeId(promoCode.getId());
            if (!classRestrictions.isEmpty()) {
                boolean isApplicable = classRestrictions.stream()
                        .anyMatch(vc -> vc.getVehicleClassId().equals(vehicleClassId));
                if (!isApplicable) {
                    throw new IllegalArgumentException("Promo code is not applicable for the selected vehicle class");
                }
            }
        }

        return mapToResponse(promoCode);
    }

    // ========== Helpers ==========

    private PromoCode findOrThrow(Integer id) {
        return promoCodeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Promo code not found with id: " + id));
    }

    private PromoCodeResponse mapToResponse(PromoCode pc) {
        List<Integer> classIds = vehicleClassRepository.findByPromoCodeId(pc.getId())
                .stream().map(PromoCodeVehicleClass::getVehicleClassId).collect(Collectors.toList());

        BigDecimal totalDiscount = usageRepository.sumDiscountByPromoCodeId(pc.getId());

        return PromoCodeResponse.builder()
                .id(pc.getId())
                .code(pc.getCode())
                .name(pc.getName())
                .description(pc.getDescription())
                .discountType(pc.getDiscountType())
                .discountValue(pc.getDiscountValue())
                .maxDiscountAmount(pc.getMaxDiscountAmount())
                .minimumFare(pc.getMinimumFare())
                .startDate(pc.getStartDate())
                .endDate(pc.getEndDate())
                .maxUsage(pc.getMaxUsage())
                .currentUsage(pc.getCurrentUsage())
                .maxUsagePerCustomer(pc.getMaxUsagePerCustomer())
                .isFirstTimeOnly(pc.getIsFirstTimeOnly())
                .minimumHireCount(pc.getMinimumHireCount())
                .maxHireCount(pc.getMaxHireCount())
                .applicableTo(pc.getApplicableTo())
                .corporateId(pc.getCorporateId())
                .isActive(pc.getIsActive())
                .createdBy(pc.getCreatedBy())
                .vehicleClassIds(classIds)
                .totalDiscountGiven(totalDiscount)
                .createdAt(pc.getCreatedAt())
                .updatedAt(pc.getUpdatedAt())
                .build();
    }

    private PromoCodeUsageResponse mapUsageToResponse(PromoCodeUsage usage) {
        return PromoCodeUsageResponse.builder()
                .id(usage.getId())
                .promoCodeId(usage.getPromoCode().getId())
                .promoCode(usage.getPromoCode().getCode())
                .contactNumber(usage.getContactNumber())
                .bookingId(usage.getBookingId())
                .discountApplied(usage.getDiscountApplied())
                .usedAt(usage.getUsedAt())
                .build();
    }
}