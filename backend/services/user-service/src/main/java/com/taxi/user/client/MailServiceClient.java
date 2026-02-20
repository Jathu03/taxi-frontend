package com.taxi.user.client;

import com.taxi.user.dto.request.SendEmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client for communicating with Mail Service
 */
@FeignClient(name = "mail-service")
public interface MailServiceClient {

    @PostMapping("/api/emails/send")
    void sendEmail(@RequestBody SendEmailRequest request);
}
