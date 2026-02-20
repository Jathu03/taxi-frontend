package com.taxi.report.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ReportFilterRequest {

    private LocalDate startDate;
    private LocalDate endDate;
    private List<Long> driverIds;
    private List<Long> vehicleIds;
    private List<Long> corporateIds;
    private List<Long> vehicleClassIds;
    private List<String> statuses;
    private Long companyId;
}