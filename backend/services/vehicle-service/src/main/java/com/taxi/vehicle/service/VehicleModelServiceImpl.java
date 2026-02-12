package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.VehicleModelCreateRequest;
import com.taxi.vehicle.dto.request.VehicleModelUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleModelResponse;
import com.taxi.vehicle.entity.VehicleMake;
import com.taxi.vehicle.entity.VehicleModel;
import com.taxi.vehicle.enums.FrameType;
import com.taxi.vehicle.enums.FuelType;
import com.taxi.vehicle.enums.TransmissionType;
import com.taxi.vehicle.enums.TurboType;
import com.taxi.vehicle.repository.VehicleMakeRepository;
import com.taxi.vehicle.repository.VehicleModelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VehicleModelServiceImpl implements VehicleModelService {

    private final VehicleModelRepository modelRepository;
    private final VehicleMakeRepository makeRepository;

    @Override
    public VehicleModelResponse createModel(VehicleModelCreateRequest request) {
        log.info("Creating vehicle model: {} for make ID: {}", request.getModel(), request.getMakeId());

        VehicleMake make = makeRepository.findById(request.getMakeId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Vehicle make not found with id: " + request.getMakeId()));

        if (modelRepository.existsByModelAndMakeId(request.getModel(), request.getMakeId())) {
            throw new IllegalArgumentException(
                    "Model '" + request.getModel() + "' already exists for make '" + make.getManufacturer() + "'");
        }

        VehicleModel model = VehicleModel.builder()
                .make(make)
                .model(request.getModel())
                .modelCode(request.getModelCode())
                .frame(FrameType.fromString(request.getFrame()))
                .transmissionType(TransmissionType.fromString(request.getTransmissionType()))
                .trimLevel(request.getTrimLevel())
                .fuelType(FuelType.fromString(request.getFuelType()))
                .turbo(TurboType.fromString(request.getTurbo()))
                .comments(request.getComments())
                .build();

        VehicleModel saved = modelRepository.save(model);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleModelResponse getModelById(Integer id) {
        VehicleModel model = findModelOrThrow(id);
        return mapToResponse(model);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleModelResponse> getAllModels(Pageable pageable) {
        return modelRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleModelResponse> searchModels(String search, Pageable pageable) {
        return modelRepository.searchModels(search, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleModelResponse> getModelsByMakeId(Integer makeId) {
        if (!makeRepository.existsById(makeId)) {
            throw new EntityNotFoundException("Vehicle make not found with id: " + makeId);
        }
        return modelRepository.findByMakeId(makeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleModelResponse> searchModelsByMake(Integer makeId, String search, Pageable pageable) {
        if (!makeRepository.existsById(makeId)) {
            throw new EntityNotFoundException("Vehicle make not found with id: " + makeId);
        }
        return modelRepository.searchModelsByMake(makeId, search, pageable).map(this::mapToResponse);
    }

    @Override
    public VehicleModelResponse updateModel(Integer id, VehicleModelUpdateRequest request) {
        VehicleModel model = findModelOrThrow(id);

        // If makeId is being changed
        if (request.getMakeId() != null && !request.getMakeId().equals(model.getMake().getId())) {
            VehicleMake newMake = makeRepository.findById(request.getMakeId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Vehicle make not found with id: " + request.getMakeId()));
            model.setMake(newMake);
        }

        // Validate duplicate model name under same make
        if (request.getModel() != null) {
            Integer currentMakeId = model.getMake().getId();
            if (!request.getModel().equals(model.getModel()) &&
                    modelRepository.existsByModelAndMakeId(request.getModel(), currentMakeId)) {
                throw new IllegalArgumentException(
                        "Model '" + request.getModel() + "' already exists for this make");
            }
            model.setModel(request.getModel());
        }

        if (request.getModelCode() != null) {
            model.setModelCode(request.getModelCode());
        }
        if (request.getFrame() != null) {
            model.setFrame(FrameType.fromString(request.getFrame()));
        }
        if (request.getTransmissionType() != null) {
            model.setTransmissionType(TransmissionType.fromString(request.getTransmissionType()));
        }
        if (request.getTrimLevel() != null) {
            model.setTrimLevel(request.getTrimLevel());
        }
        if (request.getFuelType() != null) {
            model.setFuelType(FuelType.fromString(request.getFuelType()));
        }
        if (request.getTurbo() != null) {
            model.setTurbo(TurboType.fromString(request.getTurbo()));
        }
        if (request.getComments() != null) {
            model.setComments(request.getComments());
        }

        VehicleModel updated = modelRepository.save(model);
        return mapToResponse(updated);
    }

    @Override
    public void deleteModel(Integer id) {
        VehicleModel model = findModelOrThrow(id);
        modelRepository.delete(model);
    }

    private VehicleModel findModelOrThrow(Integer id) {
        return modelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Vehicle model not found with id: " + id));
    }

    private VehicleModelResponse mapToResponse(VehicleModel model) {
        return VehicleModelResponse.builder()
                .id(model.getId())
                .makeId(model.getMake().getId())
                .makeName(model.getMake().getManufacturer())
                .model(model.getModel())
                .modelCode(model.getModelCode())
                .frame(model.getFrame() != null ? model.getFrame().name() : null)
                .transmissionType(model.getTransmissionType() != null ? model.getTransmissionType().name() : null)
                .trimLevel(model.getTrimLevel())
                .fuelType(model.getFuelType() != null ? model.getFuelType().name() : null)
                .turbo(model.getTurbo() != null ? model.getTurbo().name() : null)
                .comments(model.getComments())
                .createdAt(model.getCreatedAt())
                .updatedAt(model.getUpdatedAt())
                .build();
    }
}