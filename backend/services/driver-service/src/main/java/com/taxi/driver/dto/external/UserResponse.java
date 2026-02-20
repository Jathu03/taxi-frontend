package com.taxi.driver.dto.external;

import lombok.Data;

@Data
public class UserResponse {
    private Integer id;
    private String username;
    private String email;
    private String phoneNumber;
}
