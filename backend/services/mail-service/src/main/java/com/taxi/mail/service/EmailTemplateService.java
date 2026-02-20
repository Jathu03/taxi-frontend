package com.taxi.mail.service;

import com.taxi.mail.entity.NotificationType;
import com.taxi.mail.repository.NotificationTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing notification types (templates)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailTemplateService {

    private final NotificationTypeRepository repository;

    /**
     * Get all templates
     */
    public List<NotificationType> getAllTemplates() {
        return repository.findAll();
    }

    /**
     * Get all active templates
     */
    public List<NotificationType> getActiveTemplates() {
        return repository.findByIsActiveTrue();
    }

    /**
     * Get template by ID
     */
    public NotificationType getTemplateById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with ID: " + id));
    }

    /**
     * Get template by code
     */
    public NotificationType getTemplateByCode(String code) {
        return repository.findByTypeCode(code)
                .orElseThrow(() -> new RuntimeException("Template not found with code: " + code));
    }

    /**
     * Create new template
     */
    @Transactional
    public NotificationType createTemplate(NotificationType template) {
        if (repository.existsByTypeCode(template.getTypeCode())) {
            throw new RuntimeException("Template with code already exists: " + template.getTypeCode());
        }
        return repository.save(template);
    }

    /**
     * Update existing template
     */
    @Transactional
    public NotificationType updateTemplate(Integer id, NotificationType updatedTemplate) {
        NotificationType existing = getTemplateById(id);

        existing.setTypeName(updatedTemplate.getTypeName());
        existing.setDescription(updatedTemplate.getDescription());
        existing.setIsActive(updatedTemplate.getIsActive());

        // Update flags
        existing.setSendEmail(updatedTemplate.getSendEmail());
        existing.setSendSms(updatedTemplate.getSendSms());
        existing.setSendPush(updatedTemplate.getSendPush());

        // Update content
        existing.setEmailSubject(updatedTemplate.getEmailSubject());
        existing.setEmailTemplate(updatedTemplate.getEmailTemplate());
        existing.setSmsTemplate(updatedTemplate.getSmsTemplate());
        existing.setPushTitle(updatedTemplate.getPushTitle());
        existing.setPushTemplate(updatedTemplate.getPushTemplate());

        return repository.save(existing);
    }

    /**
     * Delete template
     */
    @Transactional
    public void deleteTemplate(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Template not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * Toggle template active status
     */
    @Transactional
    public NotificationType toggleTemplateStatus(Integer id) {
        NotificationType template = getTemplateById(id);
        template.setIsActive(!template.getIsActive());
        return repository.save(template);
    }
}
