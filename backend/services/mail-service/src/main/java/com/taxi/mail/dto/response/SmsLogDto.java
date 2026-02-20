package com.taxi.mail.dto.response;

import com.taxi.mail.enums.SmsStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SmsLogDto {
    private Long id;
    private String smsType;
    private String phoneNumbers;
    private Integer recipientCount;
    private String message;
    private SmsStatus status;
    private Integer sentCount;
    private Integer failedCount;
    private LocalDateTime sentAt;
    private String providerName;
    private String errorMessage;
    private LocalDateTime createdAt;
}