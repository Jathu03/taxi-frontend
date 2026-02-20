package com.taxi.mail.controller;

import com.taxi.mail.dto.response.SmsLogDto;
import com.taxi.mail.dto.request.SmsRequestDto;
import com.taxi.mail.service.SmsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
public class SmsController {

    private final SmsService smsService;

    @PostMapping("/send")
    public ResponseEntity<SmsLogDto> sendSms(@Valid @RequestBody SmsRequestDto request) {
        return ResponseEntity.ok(smsService.sendBulkSms(request));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SmsLogDto>> getLogs() {
        return ResponseEntity.ok(smsService.getAllLogs());
    }
}