package com.taxi.mail.repository;

import com.taxi.mail.entity.EmailLog;
import com.taxi.mail.enums.EmailStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for EmailLog entity
 */
@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Integer> {

    /**
     * Find all email logs for a specific booking
     */
    List<EmailLog> findByBookingId(String bookingId);

    /**
     * Find all emails by status
     */
    List<EmailLog> findByStatus(EmailStatus status);

    /**
     * Find failed emails that can be retried
     */
    List<EmailLog> findByStatusAndRetryCountLessThan(EmailStatus status, Integer maxRetries);

    /**
     * Find emails by recipient email
     */
    List<EmailLog> findByRecipientEmail(String recipientEmail);
}
