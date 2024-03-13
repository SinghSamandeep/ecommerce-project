package com.example.ecommercewatch.service;

import com.example.ecommercewatch.model.ApiResponse;
import com.example.ecommercewatch.model.PaymentDetails;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OrderService {
    ResponseEntity<ApiResponse<Page<PaymentDetails>>> fetchOrderDetails(int page, int size);
}
