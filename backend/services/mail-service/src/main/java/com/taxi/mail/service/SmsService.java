package com.taxi.mail.service;

import com.taxi.mail.dto.response.SmsLogDto;
import com.taxi.mail.dto.request.SmsRequestDto;
import com.taxi.mail.entity.SmsLog;
import com.taxi.mail.enums.SmsStatus;
import com.taxi.mail.repository.SmsLogRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsService {

    private final SmsLogRepository smsLogRepository;

    @Value("${taxi.sms.twilio.account-sid}")
    private String accountSid;

    @Value("${taxi.sms.twilio.auth-token}")
    private String authToken;

    @Value("${taxi.sms.twilio.trial-number}")
    private String fromNumber;

    /**
     * Initialize Twilio on startup
     */
    @PostConstruct
    public void init() {
        try {
            Twilio.init(accountSid, authToken);
            log.info("Twilio initialized successfully");
        } catch (Exception e) {
            log.error("Twilio initialization failed: {}", e.getMessage());
        }
    }

    /**
     * Public method called by Controller.
     * Saves PENDING log and triggers background task.
     */
    @Transactional
    public SmsLogDto sendBulkSms(SmsRequestDto request) {
        SmsLog smsLog = new SmsLog();

        // Convert list to string for DB
        String numbersStr = String.join(",", request.getPhoneNumbers());
        if (numbersStr.length() > 60000) {
            // Safety check for TEXT column limit
            numbersStr = numbersStr.substring(0, 60000) + "...(truncated)";
        }

        smsLog.setPhoneNumbers(numbersStr);
        smsLog.setRecipientCount(request.getPhoneNumbers().size());
        smsLog.setMessage(request.getMessage());
        smsLog.setSmsType(request.getSmsType());
        smsLog.setDriverId(request.getDriverId());
        smsLog.setCorporateId(request.getCorporateId());
        smsLog.setVehicleClassId(request.getVehicleClassId());
        smsLog.setSentBy(request.getSentByUserId());
        smsLog.setStatus(SmsStatus.PENDING);
        smsLog.setProviderName("TWILIO");

        SmsLog savedLog = smsLogRepository.save(smsLog);

        // Run the actual sending in the background
        processSmsAsync(savedLog.getId(), request.getPhoneNumbers(), request.getMessage());

        return mapToDto(savedLog);
    }

    /**
     * Background Process
     */
    @Async
    public void processSmsAsync(Long logId, List<String> phoneNumbers, String messageBody) {
        log.info("Starting Async SMS sending for Log ID: {}", logId);

        SmsLog smsLog = smsLogRepository.findById(logId).orElse(null);
        if (smsLog == null)
            return;

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);
        StringBuilder errorDetails = new StringBuilder();

        for (String recipient : phoneNumbers) {
            try {
                // Check format (Basic E.164 check)
                if (!recipient.startsWith("+")) {
                    throw new IllegalArgumentException("Number must start with + (E.164 format)");
                }

                Message.creator(
                        new PhoneNumber(recipient),
                        new PhoneNumber(fromNumber),
                        messageBody).create();

                successCount.incrementAndGet();

            } catch (Exception e) {
                failCount.incrementAndGet();
                String errorMsg = recipient + ": " + e.getMessage();
                log.error("SMS Failed: {}", errorMsg);
                // Append error to log (limit size)
                if (errorDetails.length() < 5000) {
                    errorDetails.append(errorMsg).append("; ");
                }
            }
        }

        // Update Final Status
        if (successCount.get() == phoneNumbers.size()) {
            smsLog.setStatus(SmsStatus.SENT);
        } else if (successCount.get() > 0) {
            smsLog.setStatus(SmsStatus.PARTIAL);
        } else {
            smsLog.setStatus(SmsStatus.FAILED);
        }

        smsLog.setSentCount(successCount.get());
        smsLog.setFailedCount(failCount.get());
        smsLog.setErrorMessage(errorDetails.toString());
        smsLog.setSentAt(LocalDateTime.now());

        smsLogRepository.save(smsLog);
        log.info("Completed SMS Log ID: {}. Success: {}, Failed: {}", logId, successCount, failCount);
    }

    public List<SmsLogDto> getAllLogs() {
        return smsLogRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private SmsLogDto mapToDto(SmsLog entity) {
        SmsLogDto dto = new SmsLogDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}