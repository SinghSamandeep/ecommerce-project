package com.example.ecommercewatch.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class CustomerAddress {
    private String line1;
    private String line2; // This can be optional
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
