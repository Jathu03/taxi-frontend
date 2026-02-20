package com.taxi.farepromo.service;

import com.taxi.farepromo.dto.request.FareSchemeCreateRequest;
import com.taxi.farepromo.dto.request.FareSchemeUpdateRequest;
import com.taxi.farepromo.dto.response.FareSchemeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FareSchemeService {

    FareSchemeResponse createFareScheme(FareSchemeCreateRequest request);

    FareSchemeResponse getFareSchemeById(Integer id);

    FareSchemeResponse getFareSchemeByCode(String fareCode);

    Page<FareSchemeResponse> getAllFareSchemes(Pageable pageable);

    Page<FareSchemeResponse> searchFareSchemes(String search, String status, Pageable pageable);

    List<FareSchemeResponse> getActiveFareSchemes();

    List<FareSchemeResponse> getFareSchemesByVehicleClass(Integer vehicleClassId);

    FareSchemeResponse updateFareScheme(Integer id, FareSchemeUpdateRequest request);

    void deleteFareScheme(Integer id);

    FareSchemeResponse toggleFareSchemeStatus(Integer id);
}