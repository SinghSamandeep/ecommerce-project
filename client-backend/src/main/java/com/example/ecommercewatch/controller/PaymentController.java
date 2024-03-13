package com.example.ecommercewatch.controller;

import com.example.ecommercewatch.model.StripeSessionRequest;
import com.example.ecommercewatch.service.PaymentService;
import com.stripe.exception.StripeException;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    private static final String endpointSecret = "whsec_ae702f6248bde3eb057bb7e488f589b010ed6c83445c4520aa4407beaec55c3f"; // Replace this with your endpoint's signing secret

    @PostMapping("/create-session")
    public ResponseEntity<String> createStripeSession(@RequestBody List<StripeSessionRequest> stripeSessionRequest) {

        try {
            return  paymentService.createStripeSession(stripeSessionRequest);

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error in creating Stripe session");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in creating Stripe session");
        }
    }


    @GetMapping("/verify-payment/{sessionId}")
    public ResponseEntity<String> retrieveSession(@PathVariable String sessionId,
                                                  @RequestHeader("x-api-key") String vueApiKey) throws StripeException {

        try {
            return  paymentService.verifyPayment(sessionId,vueApiKey);

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error in Fetching Session");
        }
    }

}
