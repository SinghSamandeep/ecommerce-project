package com.example.ecommercewatch.service;

import com.example.ecommercewatch.model.StripeSessionRequest;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PaymentService {
    ResponseEntity<String> createStripeSession(List<StripeSessionRequest> stripeSessionRequest) throws StripeException;

    ResponseEntity<String> verifyPayment(String sessionId,String vueApiKey)  throws StripeException;
}
