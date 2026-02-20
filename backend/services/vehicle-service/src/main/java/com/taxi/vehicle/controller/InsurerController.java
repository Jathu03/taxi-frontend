package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.request.InsurerCreateRequest;
import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.InsurerResponse;
import com.taxi.vehicle.service.InsurerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insurers")
@RequiredArgsConstructor
public class InsurerController {

    private final InsurerService insurerService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<InsurerResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(
                insurerService.getAllActiveInsurers(), "Active insurers fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InsurerResponse>> create(@RequestBody InsurerCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.created(
                insurerService.createInsurer(request), "Insurer created"));
    }
}