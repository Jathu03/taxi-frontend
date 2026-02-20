package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.InsurerCreateRequest;
import com.taxi.vehicle.dto.response.InsurerResponse;
import com.taxi.vehicle.entity.Insurer;
import com.taxi.vehicle.repository.InsurerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsurerServiceImpl implements InsurerService {
    private final InsurerRepository insurerRepository;

    @Override
    public InsurerResponse createInsurer(InsurerCreateRequest request) {
        if (insurerRepository.existsByInsurerName(request.getInsurerName())) {
            throw new IllegalArgumentException("Insurer already exists");
        }
        Insurer insurer = Insurer.builder()
                .insurerName(request.getInsurerName())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return mapToResponse(insurerRepository.save(insurer));
    }

    @Override
    public List<InsurerResponse> getAllActiveInsurers() {
        return insurerRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InsurerResponse mapToResponse(Insurer i) {
        return InsurerResponse.builder()
                .id(i.getId())
                .insurerName(i.getInsurerName())
                .contactNumber(i.getContactNumber())
                .email(i.getEmail())
                .isActive(i.getIsActive())
                .build();
    }
}