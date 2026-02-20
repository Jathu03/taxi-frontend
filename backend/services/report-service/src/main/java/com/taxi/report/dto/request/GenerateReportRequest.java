package com.taxi.report.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class GenerateReportRequest {

    @NotBlank(message = "Report code is required")
    private String reportCode;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private List<Long> driverIds;
    private List<Long> vehicleIds;
    private List<Long> corporateIds;
    private List<Long> vehicleClassIds;
    private List<String> statuses;

    @NotBlank(message = "File format is required")
    private String fileFormat;

    @NotNull(message = "User ID is required")
    private Long generatedBy;

    private Long companyId;
}