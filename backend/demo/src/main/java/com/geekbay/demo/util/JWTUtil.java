package com.geekbay.demo.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTUtil {

    private final long EXPIRATION_TIME = 2000*60*60;

    @Value("${token.secret.key}")
    private String secret;

    public String generateToken(String email){
        try{
            String token = JWT.create()
                    .withIssuer("auth0")
                    .withSubject(email)
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .sign(Algorithm.HMAC256(secret));
            return token;
        }catch (JWTVerificationException e){
            System.out.println("Erro geração token JWT");
            throw new RuntimeException("Erro geração token JWT", e);
        }
    }


    public boolean validateToken(String token, String email, UserDetails userDetails) {
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public String verifyToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth0")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e){
            System.out.println("Erro validação token JWT");
            throw new RuntimeException("Erro validação token JWT", e);
        }
    }

    public boolean isTokenExpired(String token){
        return JWT.decode(token).getExpiresAt().before(new Date());
    }

}
