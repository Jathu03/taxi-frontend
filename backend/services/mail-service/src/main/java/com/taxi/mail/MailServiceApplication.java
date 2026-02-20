package com.taxi.mail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main application class for Mail Service
 * Handles email notifications for the taxi management system
 */
@SpringBootApplication
@EnableAsync
@EnableFeignClients(basePackages = "com.taxi.mail.client")
@EnableDiscoveryClient
public class MailServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MailServiceApplication.class, args);
    }
}
