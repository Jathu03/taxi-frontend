package com.taxi.vehicle.dto.response;

import com.taxi.vehicle.enums.FuelType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Vehicle response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {

    private Integer id;
    private String vehicleCode;
    private String registrationNumber;
    private String chassisNumber;
    private LocalDate registrationDate;
    private String revenueLicenseNumber;
    private LocalDate revenueLicenseExpiryDate;
    private Integer passengerCapacity;
    private Integer luggageCapacity;
    private String comments;
    private Integer manufactureYear;

    private VehicleMakeResponse make;
    private VehicleModelResponse model;
    private FuelType fuelType;
    private InsurerResponse insurer;

    private String insuranceNumber;
    private LocalDate insuranceExpiryDate;

    private VehicleOwnerResponse owner;
    private VehicleClassResponse vehicleClass;
    private CompanyResponse company;

    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}