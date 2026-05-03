package com.geekbay.demo.dtos.auth;

public record AuthResponse(
        String token
) {
    public AuthResponse(String token){
        this.token = token;
    }
}
