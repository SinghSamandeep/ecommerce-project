package com.example.ecommercewatch.repository;

import com.example.ecommercewatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,Long> {

    User findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}
