package com.example.ecommercewatch.security;

import com.example.ecommercewatch.model.ApiResponse;
import com.example.ecommercewatch.model.User;
import com.example.ecommercewatch.repository.UserRepository;
import com.example.ecommercewatch.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String phoneNumber = null;
        String jwt = null;
         try{
             if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                 jwt = authorizationHeader.substring(7);
                 phoneNumber = jwtUtil.getPhoneNumberFromToken(jwt); // Assuming extractUsername fetches the phone number
             }

             if (phoneNumber != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                 User user = userRepository.findByPhoneNumber(phoneNumber);

                 if (user != null && jwtUtil.validateToken(jwt, phoneNumber)) {
                     UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                             user, null, new ArrayList<>());
                     authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                     SecurityContextHolder.getContext().setAuthentication(authentication);
                 }
             }
             chain.doFilter(request, response);

         }catch(ExpiredJwtException ex){

             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
             response.setContentType("application/json");
             ApiResponse<String> apiResponse = new ApiResponse<>("TOKEN HAS EXPIRED", null, "Failed");
             new ObjectMapper().writeValue(response.getOutputStream(), apiResponse);
         }catch(JwtException ex){
             System.out.println(ex);
         }

         }

    }