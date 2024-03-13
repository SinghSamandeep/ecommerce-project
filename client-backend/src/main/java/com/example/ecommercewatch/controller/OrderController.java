package com.example.ecommercewatch.controller;


import com.example.ecommercewatch.model.ApiResponse;
import com.example.ecommercewatch.model.PaymentDetails;
import com.example.ecommercewatch.service.OrderService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/order")
@Slf4j
public class OrderController {

    @Autowired
    OrderService orderService;
    @GetMapping("/fetch")
    public ResponseEntity<ApiResponse<Page<PaymentDetails>>> fetchOrders(@RequestParam(defaultValue = "0") int page,
                                                                         @RequestParam(defaultValue = "10") int size) {

               return  orderService.fetchOrderDetails(page,size);

    }
}
