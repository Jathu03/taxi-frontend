package com.taxi.report;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Report Service
 * Aggregates data from other microservices for admin reports.
 */
@SpringBootApplication
@EnableFeignClients(basePackages = "com.taxi.report.client")
public class ReportServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReportServiceApplication.class, args);
	}
}