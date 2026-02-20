package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.InsurerCreateRequest;
import com.taxi.vehicle.dto.response.InsurerResponse;
import java.util.List;

public interface InsurerService {
    InsurerResponse createInsurer(InsurerCreateRequest request);

    List<InsurerResponse> getAllActiveInsurers();
    // ... other methods (update, delete) as needed
}