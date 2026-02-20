package com.taxi.farepromo.service;

import com.taxi.farepromo.dto.request.PromoCodeCreateRequest;
import com.taxi.farepromo.dto.request.PromoCodeUpdateRequest;
import com.taxi.farepromo.dto.request.PromoCodeUsageRequest;
import com.taxi.farepromo.dto.response.PromoCodeResponse;
import com.taxi.farepromo.dto.response.PromoCodeUsageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PromoCodeService {

    PromoCodeResponse createPromoCode(PromoCodeCreateRequest request);

    PromoCodeResponse getPromoCodeById(Integer id);

    PromoCodeResponse getPromoCodeByCode(String code);

    Page<PromoCodeResponse> getAllPromoCodes(Pageable pageable);

    Page<PromoCodeResponse> searchPromoCodes(String search, Boolean isActive, Pageable pageable);

    List<PromoCodeResponse> getActivePromoCodes();

    List<PromoCodeResponse> getValidPromoCodes();

    PromoCodeResponse updatePromoCode(Integer id, PromoCodeUpdateRequest request);

    void deletePromoCode(Integer id);

    PromoCodeResponse togglePromoCodeStatus(Integer id);

    // Usage
    PromoCodeUsageResponse recordUsage(PromoCodeUsageRequest request);

    Page<PromoCodeUsageResponse> getUsageByPromoCode(Integer promoCodeId, Pageable pageable);

    // Validation (Called by other services via API)
    PromoCodeResponse validatePromoCode(String code, String contactNumber, Integer vehicleClassId);
}