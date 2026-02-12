package com.taxi.mail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Main application class for Mail Service
 * Handles email notifications for the taxi management system
 */
@SpringBootApplication
@EnableFeignClients(basePackages = "com.taxi.mail.client")
public class MailServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MailServiceApplication.class, args);
    }
}
