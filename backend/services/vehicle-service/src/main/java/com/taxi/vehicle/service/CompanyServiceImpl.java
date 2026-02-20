package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.CompanyCreateRequest;
import com.taxi.vehicle.dto.request.CompanyUpdateRequest;
import com.taxi.vehicle.dto.response.CompanyResponse;
import com.taxi.vehicle.entity.Company;
import com.taxi.vehicle.repository.CompanyRepository;
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
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    public CompanyResponse createCompany(CompanyCreateRequest request) {
        log.info("Creating company with name: {}", request.getCompanyName());

        if (request.getCompanyCode() != null &&
                companyRepository.existsByCompanyCode(request.getCompanyCode())) {
            throw new IllegalArgumentException(
                    "Company code already exists: " + request.getCompanyCode());
        }

        if (companyRepository.existsByCompanyName(request.getCompanyName())) {
            throw new IllegalArgumentException(
                    "Company name already exists: " + request.getCompanyName());
        }

        Company company = Company.builder()
                .companyName(request.getCompanyName())
                .companyCode(request.getCompanyCode())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Company savedCompany = companyRepository.save(company);
        return mapToResponse(savedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Integer id) {
        Company company = findCompanyOrThrow(id);
        return mapToResponse(company);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyByCode(String companyCode) {
        Company company = companyRepository.findByCompanyCode(companyCode)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Company not found with code: " + companyCode));
        return mapToResponse(company);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponse> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllActiveCompanies() {
        return companyRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponse> searchCompanies(String search, Boolean isActive, Pageable pageable) {
        if (isActive != null) {
            return companyRepository.searchCompaniesWithFilter(search, isActive, pageable)
                    .map(this::mapToResponse);
        }
        return companyRepository.searchCompanies(search, pageable).map(this::mapToResponse);
    }

    @Override
    public CompanyResponse updateCompany(Integer id, CompanyUpdateRequest request) {
        Company company = findCompanyOrThrow(id);

        if (request.getCompanyCode() != null &&
                !request.getCompanyCode().equals(company.getCompanyCode()) &&
                companyRepository.existsByCompanyCode(request.getCompanyCode())) {
            throw new IllegalArgumentException(
                    "Company code already exists: " + request.getCompanyCode());
        }

        if (request.getCompanyName() != null) {
            company.setCompanyName(request.getCompanyName());
        }
        if (request.getCompanyCode() != null) {
            company.setCompanyCode(request.getCompanyCode());
        }
        if (request.getIsActive() != null) {
            company.setIsActive(request.getIsActive());
        }

        Company updatedCompany = companyRepository.save(company);
        return mapToResponse(updatedCompany);
    }

    @Override
    public void deleteCompany(Integer id) {
        Company company = findCompanyOrThrow(id);
        companyRepository.delete(company);
    }

    @Override
    public CompanyResponse toggleCompanyStatus(Integer id) {
        Company company = findCompanyOrThrow(id);
        company.setIsActive(!company.getIsActive());
        Company updatedCompany = companyRepository.save(company);
        return mapToResponse(updatedCompany);
    }

    private Company findCompanyOrThrow(Integer id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Company not found with id: " + id));
    }

    private CompanyResponse mapToResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .companyCode(company.getCompanyCode())
                .isActive(company.getIsActive())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}