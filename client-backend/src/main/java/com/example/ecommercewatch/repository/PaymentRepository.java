package com.example.ecommercewatch.repository;

import com.example.ecommercewatch.model.PaymentDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface PaymentRepository extends JpaRepository<PaymentDetails,Long> {
    @Query(nativeQuery = true,value = "SELECT * FROM payment_details WHERE phone_number=:phoneNumber")
    Page<PaymentDetails> findByPhone(String phoneNumber, Pageable pageable);
}
