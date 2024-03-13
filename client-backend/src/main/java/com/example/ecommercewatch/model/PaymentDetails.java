package com.example.ecommercewatch.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "payment_details")
public class PaymentDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productId;
    private String transactionId;
    private String orderDate;
    private String paymentStatus;
    private String orderStatus;
    private double price;
    private Integer quantity;
    private String phoneNumber;
    private String emailId;
    private CustomerAddress address;

}
