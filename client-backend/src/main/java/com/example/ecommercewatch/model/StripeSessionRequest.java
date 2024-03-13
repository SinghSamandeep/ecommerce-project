package com.example.ecommercewatch.model;

import lombok.Data;

@Data
public class StripeSessionRequest {
    private String name;
    private double price;
    private int quantity;
    private String productId;

}
