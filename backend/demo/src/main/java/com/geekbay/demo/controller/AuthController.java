package com.geekbay.demo.controller;

import com.geekbay.demo.dtos.auth.AuthRequest;
import com.geekbay.demo.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JWTUtil jwtUtil;

    @PostMapping("/login")
    public String generateToken(@RequestBody AuthRequest authRequest){
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.email(), authRequest.senha()));
            return jwtUtil.generateToken(authRequest.email());
        } catch (Exception e){
            throw e;
        }
    }



}
