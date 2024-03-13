package com.example.ecommercewatch.service.serviceimpl;

import com.example.ecommercewatch.model.LoginReturn;
import com.example.ecommercewatch.model.User;
import com.example.ecommercewatch.repository.UserRepository;
import com.example.ecommercewatch.service.UserService;
import com.example.ecommercewatch.utils.JwtUtil;
import com.sun.security.auth.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.ecommercewatch.utils.Utils;

import java.security.SecureRandom;
import java.util.Base64;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;
    @Override
    public ResponseEntity<String> registerNewUserAccount(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return Utils.getResponseEntity("Successfully Registered", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<LoginReturn> loginUser(String phoneNumber, String password) {
        LoginReturn loginReturn = new LoginReturn();

        try {

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(phoneNumber, password)
            );

            if (auth.isAuthenticated()) {
                User user = userRepository.findByPhoneNumber(phoneNumber);
                if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                    String token = jwtUtil.generateToken(user.getPhoneNumber());
                    loginReturn.setName(user.getName());
                    loginReturn.setPhoneNumber(user.getPhoneNumber());
                    loginReturn.setToken(token);
                    return ResponseEntity.status(HttpStatus.OK).body(loginReturn);

                } else {
                    loginReturn.setMessage("Unable To Verify User");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(loginReturn);
                }
            }
        } catch(BadCredentialsException e) {
            loginReturn.setMessage("Password is Wrong");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginReturn);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(loginReturn);
        }
        loginReturn.setMessage("An unexpected error occurred.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(loginReturn);
    }

}
