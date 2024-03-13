package com.example.ecommercewatch.model;

import lombok.Data;

@Data
public class LoginReturn {
    private String name;
    private String phoneNumber;
    private String token;
    private String message;
}
