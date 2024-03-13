package com.example.ecommercewatch.AdminApi;

import com.example.ecommercewatch.model.PaymentDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class PaymentDetailSend {

    private final WebClient webClient;
    private final String nodeJsApiKey;
    @Autowired
    public PaymentDetailSend(WebClient webClient,@Value("${nodejs.api.key}") String nodeJsApiKey) {
        this.webClient = webClient;
        this.nodeJsApiKey = nodeJsApiKey;
    }

    public Mono<ResponseEntity<String>> sendPaymentDetails(List<PaymentDetails> paymentDetailsList) {
        String url = "http://localhost:5000/api/payment/payment-details";
        return webClient.post()
                .uri(url)
                .header("x-api-key",nodeJsApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(paymentDetailsList))
                .retrieve()
                .toEntity(String.class);
    }
}
