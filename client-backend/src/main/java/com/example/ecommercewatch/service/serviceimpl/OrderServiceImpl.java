package com.example.ecommercewatch.service.serviceimpl;

import com.example.ecommercewatch.model.ApiResponse;
import com.example.ecommercewatch.model.PaymentDetails;
import com.example.ecommercewatch.model.StripeSessionRequest;
import com.example.ecommercewatch.model.User;
import com.example.ecommercewatch.repository.PaymentRepository;
import com.example.ecommercewatch.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service

public class OrderServiceImpl implements OrderService {
    @Autowired
    PaymentRepository paymentRepository;
    @Override
    public ResponseEntity<ApiResponse<Page<PaymentDetails>>> fetchOrderDetails(int page, int size) {
        Pageable pageable =  PageRequest.of(page,size);
        String phoneNumber ="";
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            phoneNumber = user.getPhoneNumber();
            System.out.println(user.getPhoneNumber());
        }
       try{
           Page<PaymentDetails> paymentDetailsList = paymentRepository.findByPhone(phoneNumber, pageable);
           ApiResponse<Page<PaymentDetails>> apiResponse = new ApiResponse<>("Order Fetched Successfully",
                   paymentDetailsList, "SUCCESS");

           return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception ex){
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                   new ApiResponse<>( "Some Unexpected Error Occurred", null, "FAILED")
           );
        }

    }
}
