package com.example.ecommercewatch.service;

import com.example.ecommercewatch.model.LoginReturn;
import com.example.ecommercewatch.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService {
    ResponseEntity<String> registerNewUserAccount(User user);
    ResponseEntity<LoginReturn> loginUser(String phoneNumber, String password);

}
