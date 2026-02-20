package com.taxi.vehicle.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VehicleCreateRequest {
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

    // Foreign Key IDs
    private Integer makeId;
    private Integer modelId;
    private String fuelType;
    private Integer insurerId;
    private String insuranceNumber;
    private LocalDate insuranceExpiryDate;
    private Integer ownerId;
    private Integer classId;
    private Integer companyId;
    private Integer fareSchemeId;

    private Boolean isActive;
}