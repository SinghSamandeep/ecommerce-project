package com.example.ecommercewatch.controller;

import com.example.ecommercewatch.model.User;
import com.example.ecommercewatch.service.UserService;
import com.example.ecommercewatch.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try{
            return  userService.registerNewUserAccount(user);

        }catch(Exception ex){
            return Utils.getResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String phoneNumber,
                                       @RequestParam String password) {

        try{
                return userService.loginUser(phoneNumber,password);
        }catch(Exception ex){
            log.info(String.valueOf(ex));
            return Utils.getResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
