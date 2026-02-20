package com.taxi.mail.controller;

import com.taxi.mail.entity.NotificationType;
import com.taxi.mail.service.EmailTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for email template management
 * Now managing NotificationTypes
 */
@RestController
@RequestMapping("/api/email-templates")
@RequiredArgsConstructor
@Slf4j
public class EmailTemplateController {

    private final EmailTemplateService templateService;

    /**
     * Get all email templates
     * GET /api/email-templates
     */
    @GetMapping
    public ResponseEntity<List<NotificationType>> getAllTemplates() {
        log.info("Fetching all notification templates");
        List<NotificationType> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }

    /**
     * Get active email templates
     * GET /api/email-templates/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<NotificationType>> getActiveTemplates() {
        log.info("Fetching active notification templates");
        List<NotificationType> templates = templateService.getActiveTemplates();
        return ResponseEntity.ok(templates);
    }

    /**
     * Get template by ID
     * GET /api/email-templates/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<NotificationType> getTemplateById(@PathVariable Integer id) {
        log.info("Fetching notification template with ID: {}", id);
        NotificationType template = templateService.getTemplateById(id);
        return ResponseEntity.ok(template);
    }

    /**
     * Get template by code
     * GET /api/email-templates/code/{code}
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<NotificationType> getTemplateByCode(@PathVariable String code) {
        log.info("Fetching notification template with code: {}", code);
        NotificationType template = templateService.getTemplateByCode(code);
        return ResponseEntity.ok(template);
    }

    /**
     * Create new template
     * POST /api/email-templates
     */
    @PostMapping
    public ResponseEntity<NotificationType> createTemplate(@RequestBody NotificationType template) {
        log.info("Creating new notification template with code: {}", template.getTypeCode());
        NotificationType created = templateService.createTemplate(template);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update template
     * PUT /api/email-templates/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<NotificationType> updateTemplate(
            @PathVariable Integer id,
            @RequestBody NotificationType template) {
        log.info("Updating notification template with ID: {}", id);
        NotificationType updated = templateService.updateTemplate(id, template);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete template
     * DELETE /api/email-templates/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Integer id) {
        log.info("Deleting notification template with ID: {}", id);
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Toggle template active status
     * PATCH /api/email-templates/{id}/toggle
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<NotificationType> toggleTemplateStatus(@PathVariable Integer id) {
        log.info("Toggling status for notification template with ID: {}", id);
        NotificationType updated = templateService.toggleTemplateStatus(id);
        return ResponseEntity.ok(updated);
    }
}
