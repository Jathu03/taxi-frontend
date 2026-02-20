package com.taxi.booking.client;

import com.taxi.booking.dto.request.SendEmailRequest;
import com.taxi.booking.dto.response.EmailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client for Mail Service
 */
@FeignClient(name = "mail-service")
public interface MailServiceClient {
    @PostMapping("/api/emails/send")
    EmailResponse sendEmail(@RequestBody SendEmailRequest request);
}
