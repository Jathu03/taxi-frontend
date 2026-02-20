package com.taxi.vehicle.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
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

    // Expanded Foreign Keys
    private Integer makeId;
    private String makeName;
    private Integer modelId;
    private String modelName;
    private String fuelType;
    private Integer insurerId;
    private String insurerName;
    private String insuranceNumber;
    private LocalDate insuranceExpiryDate;
    private Integer ownerId;
    private String ownerName;
    private Integer classId;
    private String className;
    private Integer companyId;
    private String companyName;
    private Integer fareSchemeId;

    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}