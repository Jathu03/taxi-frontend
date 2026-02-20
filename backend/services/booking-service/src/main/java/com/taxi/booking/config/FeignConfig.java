package com.taxi.booking.config;

import com.fasterxml.jackson.databind.DeserializationFeature; // Import this
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Logger;
import feign.Response;
import feign.Util;
import feign.codec.Decoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;

@Configuration
public class FeignConfig {

    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Decoder feignDecoder() {
        // 1. Create a Mapper that ignores fields not present in your DTOs
        ObjectMapper mapper = new ObjectMapper()
                .findAndRegisterModules()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); // <--- CRITICAL FIX

        return new UnwrappingDecoder(mapper);
    }

    public static class UnwrappingDecoder implements Decoder {
        private final ObjectMapper mapper;

        public UnwrappingDecoder(ObjectMapper mapper) {
            this.mapper = mapper;
        }

        @Override
        public Object decode(Response response, Type type) throws IOException {
            if (response.body() == null)
                return null;

            String bodyStr = Util.toString(response.body().asReader(StandardCharsets.UTF_8));
            JsonNode root = mapper.readTree(bodyStr);

            // 2. Unwrap if it is { success: true, data: ... }
            if (root.has("success") && root.has("data")) {
                JsonNode dataNode = root.get("data");
                if (dataNode.isNull())
                    return null;
                return mapper.readValue(dataNode.traverse(), mapper.constructType(type));
            }

            // 3. Standard decode
            return mapper.readValue(root.traverse(), mapper.constructType(type));
        }
    }
}