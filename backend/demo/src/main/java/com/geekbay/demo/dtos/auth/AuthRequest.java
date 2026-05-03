package com.geekbay.demo.dtos.auth;

public record AuthRequest(
        String email,
        String senha
){}
