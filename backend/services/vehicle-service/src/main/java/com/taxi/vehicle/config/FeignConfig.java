package com.taxi.vehicle.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Feign clients
 */
@Configuration
public class FeignConfig {

    /**
     * Set Feign log level for debugging
     */
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}