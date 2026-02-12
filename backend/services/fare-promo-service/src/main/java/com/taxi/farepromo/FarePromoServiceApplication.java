package com.taxi.farepromo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Main application class for Fare Service
 * Manages fare schemes and pricing configurations
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.taxi.farepromo.client")
public class FarePromoServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FarePromoServiceApplication.class, args);
    }
}