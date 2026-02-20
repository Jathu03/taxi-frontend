package com.taxi.mail.repository;

import com.taxi.mail.entity.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for EmailTemplate entity
 */
@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Integer> {

    /**
     * Find template by template code
     */
    Optional<EmailTemplate> findByTemplateCode(String templateCode);

    /**
     * Find all active templates
     */
    List<EmailTemplate> findByIsActiveTrue();

    /**
     * Check if template code exists
     */
    boolean existsByTemplateCode(String templateCode);
}
