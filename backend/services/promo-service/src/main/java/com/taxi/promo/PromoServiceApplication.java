package com.taxi.promo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Main application class for Promo Service
 * Manages promo codes, vehicle class assignments, and usage tracking
 */
@SpringBootApplication
@EnableFeignClients(basePackages = "com.taxi.promo.client")
public class PromoServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PromoServiceApplication.class, args);
	}
}