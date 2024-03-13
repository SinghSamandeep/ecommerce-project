package com.example.ecommercewatch.service.serviceimpl;

import com.example.ecommercewatch.AdminApi.PaymentDetailSend;
import com.example.ecommercewatch.model.CustomerAddress;
import com.example.ecommercewatch.model.PaymentDetails;
import com.example.ecommercewatch.model.StripeSessionRequest;
import com.example.ecommercewatch.model.User;
import com.example.ecommercewatch.repository.PaymentRepository;
import com.example.ecommercewatch.repository.UserRepository;
import com.example.ecommercewatch.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import com.stripe.param.checkout.SessionListLineItemsParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    PaymentDetailSend paymentDetailSend;
    @Value("${stripe.api.key}")
    private String stripeApiKey;
    @Value("${nodejs.api.key}")
    private String nodejsApiKey;



    @Override
    public ResponseEntity<String> createStripeSession(List<StripeSessionRequest> stripeSessionRequest) {
        Stripe.apiKey = stripeApiKey;
       try{
           List<SessionCreateParams.LineItem> sessionItems = stripeSessionRequest.stream().map(item -> SessionCreateParams.LineItem.builder()
                   .setQuantity((long) item.getQuantity())
                   .setPriceData(
                           SessionCreateParams.LineItem.PriceData.builder()
                                   .setCurrency("inr")
                                   .setUnitAmount((long) (item.getPrice() * 100))
                                   .setProductData(
                                           SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                   .setName(item.getName())
                                                   .putMetadata("product_id", item.getProductId())
                                                   .build()
                                   )
                                   .build()
                   )
                   .build()).collect(Collectors.toList());



           SessionCreateParams params = SessionCreateParams.builder()
                   .setSuccessUrl("http://127.0.0.1:5173/payment-success?session_id={CHECKOUT_SESSION_ID}")
                   .setCancelUrl("http://127.0.0.1:5173/payment-success?session_id={CHECKOUT_SESSION_ID}")
                   .addAllLineItem(sessionItems)
                   .setMode(SessionCreateParams.Mode.PAYMENT)
                   .setBillingAddressCollection(SessionCreateParams.BillingAddressCollection.REQUIRED) // Prompt for billing address
                   .setShippingAddressCollection(
                           SessionCreateParams.ShippingAddressCollection.builder()
                                   .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.valueOf("IN"))
                                   .build()
                   )
                   .build();
           Session session = Session.create(params);
           return ResponseEntity.ok(session.getId());
       }catch (Exception ex){
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
       }

    }

    @Override
    public ResponseEntity<String> verifyPayment(String sessionId,String vueApiKey) {
        if(!Objects.equals(vueApiKey, nodejsApiKey)){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("AUTHENTICATION FAILED");
        }
        Stripe.apiKey = stripeApiKey;
        List<PaymentDetails> paymentDetailsList = new ArrayList<>();
        String phoneNumber ="";
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            phoneNumber = user.getPhoneNumber();
            System.out.println(user.getPhoneNumber());
        }
        try{

            SessionListLineItemsParams params = SessionListLineItemsParams.builder().build();
            Session session = Session.retrieve(sessionId);
            LineItemCollection lineItems = session.listLineItems(params);
            System.out.println(session);

            for (LineItem item : lineItems.getData()) {
                PaymentDetails detail = getPaymentDetails(item, session,phoneNumber);
                paymentDetailsList.add(detail);
            }

            System.out.println(paymentDetailsList);
            for(PaymentDetails paymentDetails:paymentDetailsList){
                paymentRepository.save(paymentDetails);
            }
            paymentDetailSend.sendPaymentDetails(paymentDetailsList);
            Mono<ResponseEntity<String>> responseMono =  paymentDetailSend.sendPaymentDetails(paymentDetailsList);

            responseMono.subscribe(
                    response -> {
                        // This block is executed on successful response.
                        if (response.getStatusCode().is2xxSuccessful()) {
                            System.out.println("Success! Response Body: " + response.getBody());
                        } else {
                            System.out.println("Received non-success status code: " + response.getStatusCode());
                        }
                    },
                    error -> {
                        // This block is executed on error.
                        System.err.println("An error occurred: " + error.getMessage());
                    },
                    () -> {
                        // This block is executed on completion of the Mono stream without any item (rare in this context).
                        System.out.println("Completed without any data.");
                    }
            );
            return ResponseEntity.ok("ITs working") ;
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }

    }

    private static PaymentDetails getPaymentDetails(LineItem item, Session session,String phoneNumber) throws StripeException {
        PaymentDetails paymentDetails = new PaymentDetails();

        String productId = item.getPrice().getProduct();
        Product product = Product.retrieve(productId);

        paymentDetails.setProductId(product.getMetadata().get("product_id"));
        paymentDetails.setTransactionId(session.getPaymentIntent());
        long sessionCreatedUnix = session.getCreated();  // Assuming this is the Unix timestamp
        ZonedDateTime sessionCreatedIST = Instant.ofEpochSecond(sessionCreatedUnix).atZone(ZoneId.of("Asia/Kolkata"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        paymentDetails.setOrderDate(sessionCreatedIST.format(formatter));
        paymentDetails.setPaymentStatus(session.getPaymentStatus());
        paymentDetails.setOrderStatus(session.getStatus());
        paymentDetails.setPrice(item.getAmountTotal() / 100.0);
        paymentDetails.setQuantity(item.getQuantity().intValue());

        Session.CustomerDetails customerDetails = session.getCustomerDetails();
        if (customerDetails != null) {
            CustomerAddress addressDetails = new CustomerAddress();
            if (customerDetails.getAddress().getLine1() != null) {
                addressDetails.setLine1(customerDetails.getAddress().getLine1());
            }
            if (customerDetails.getAddress().getLine2() != null) {
                addressDetails.setLine2(customerDetails.getAddress().getLine2());
            }
            if (customerDetails.getAddress().getCity() != null) {
                addressDetails.setCity(customerDetails.getAddress().getCity());
            }
            if (customerDetails.getAddress().getState() != null) {
                addressDetails.setState(customerDetails.getAddress().getState());
            }
            if (customerDetails.getAddress().getPostalCode() != null) {
                addressDetails.setPostalCode( customerDetails.getAddress().getPostalCode());
            }
            if (customerDetails.getAddress().getCountry() != null) {
                addressDetails.setCountry(customerDetails.getAddress().getCountry());
            }

            paymentDetails.setAddress(addressDetails);
            paymentDetails.setEmailId(customerDetails.getEmail());
        }
        paymentDetails.setPhoneNumber(phoneNumber);
        return paymentDetails;
    }

}
