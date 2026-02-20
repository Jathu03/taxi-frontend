package com.taxi.driver.client;

import com.taxi.driver.dto.external.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "user-service", path = "/api/users")
public interface UserServiceClient {

    @GetMapping
    List<UserResponse> getUsers(
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String searchTerm);
}
