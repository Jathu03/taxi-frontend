package com.taxi.vehicle.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleOwnerResponse {

    private Integer id;
    private String name;
    private String nicOrBusinessReg;
    private String company;
    private String email;
    private String primaryContact;
    private String secondaryContact;
    private String postalAddress;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}