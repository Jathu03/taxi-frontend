package com.taxi.device;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.taxi.device.client")
public class DeviceServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DeviceServiceApplication.class, args);
	}

}
