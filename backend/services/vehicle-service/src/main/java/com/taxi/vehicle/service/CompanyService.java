package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.CompanyCreateRequest;
import com.taxi.vehicle.dto.request.CompanyUpdateRequest;
import com.taxi.vehicle.dto.response.CompanyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompanyService {

    CompanyResponse createCompany(CompanyCreateRequest request);

    CompanyResponse getCompanyById(Integer id);

    CompanyResponse getCompanyByCode(String companyCode);

    Page<CompanyResponse> getAllCompanies(Pageable pageable);

    List<CompanyResponse> getAllActiveCompanies();

    Page<CompanyResponse> searchCompanies(String search, Boolean isActive, Pageable pageable);

    CompanyResponse updateCompany(Integer id, CompanyUpdateRequest request);

    void deleteCompany(Integer id);

    CompanyResponse toggleCompanyStatus(Integer id);
}