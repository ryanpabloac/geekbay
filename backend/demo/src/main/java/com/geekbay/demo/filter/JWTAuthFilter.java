package com.geekbay.demo.filter;

import com.geekbay.demo.security.UserDetailsServiceImpl;
import com.geekbay.demo.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    JWTUtil jwtUtil;
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = recuperarToken(request);
        if(token != null){  // Se token for nulo -> Gera token por meio do UsernamePasswordAuthenticationFilter -> Novo usuário
            String email = jwtUtil.verifyToken(token);
            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null){
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if(!jwtUtil.validateToken(token, email, userDetails)) throw new ServletException("Token expirado");
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // Envia detalhes da request para o token autenticado
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    public String recuperarToken(HttpServletRequest request){
        String authorizationHeader = request.getHeader("Authorization"); // Busca token do request
        if(authorizationHeader == null) {
            System.out.println("Token vazio");
            return null;
        }
        return authorizationHeader.substring(7);  // Extrai token (Bearer Token)
    }
}
