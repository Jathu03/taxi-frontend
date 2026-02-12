package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.request.CompanyCreateRequest;
import com.taxi.vehicle.dto.request.CompanyUpdateRequest;
import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.CompanyResponse;
import com.taxi.vehicle.service.CompanyService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @Valid @RequestBody CompanyCreateRequest request) {
        log.info("REST request to create company: {}", request.getCompanyName());
        try {
            CompanyResponse created = companyService.createCompany(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.created(created, "Company created successfully"));
        } catch (IllegalArgumentException e) {
            log.warn("Company creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(@PathVariable Integer id) {
        log.debug("REST request to get company by id: {}", id);
        try {
            CompanyResponse company = companyService.getCompanyById(id);
            return ResponseEntity.ok(ApiResponse.success(company, "Company retrieved successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping("/code/{companyCode}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyByCode(
            @PathVariable String companyCode) {
        log.debug("REST request to get company by code: {}", companyCode);
        try {
            CompanyResponse company = companyService.getCompanyByCode(companyCode);
            return ResponseEntity.ok(ApiResponse.success(company, "Company retrieved successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAllCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CompanyResponse> companyPage = companyService.searchCompanies(search, isActive, pageable);

        return ResponseEntity.ok(ApiResponse.paginated(
                companyPage.getContent(),
                "Companies retrieved successfully",
                companyPage.getTotalElements(),
                companyPage.getTotalPages(),
                companyPage.getNumber()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAllActiveCompanies() {
        List<CompanyResponse> companies = companyService.getAllActiveCompanies();
        return ResponseEntity.ok(ApiResponse.success(companies,
                "Active companies retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @PathVariable Integer id,
            @Valid @RequestBody CompanyUpdateRequest request) {
        log.info("REST request to update company with id: {}", id);
        try {
            CompanyResponse updated = companyService.updateCompany(id, request);
            return ResponseEntity.ok(ApiResponse.success(updated,
                    "Company updated successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable Integer id) {
        log.info("REST request to delete company with id: {}", id);
        try {
            companyService.deleteCompany(id);
            return ResponseEntity.ok(ApiResponse.success(null,
                    "Company deleted successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<CompanyResponse>> toggleCompanyStatus(
            @PathVariable Integer id) {
        try {
            CompanyResponse updated = companyService.toggleCompanyStatus(id);
            return ResponseEntity.ok(ApiResponse.success(updated,
                    "Company status toggled successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
}