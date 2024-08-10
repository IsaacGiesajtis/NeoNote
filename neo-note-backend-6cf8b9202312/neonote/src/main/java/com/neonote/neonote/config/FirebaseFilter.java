package com.neonote.neonote.config;

import com.google.firebase.auth.FirebaseAuthException;
import com.neonote.neonote.services.FirebaseService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Coded by Thomas Dickson
@Component
public class FirebaseFilter extends OncePerRequestFilter {

    private final FirebaseService firebaseService;

    public FirebaseFilter(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // get authorization header
        final String authHeader = request.getHeader("Authorization");

        // if no header, or not a bearer token return unauthorized
        if(authHeader == null || !authHeader.startsWith("Bearer")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            // verify token from Authorization header
            String token = authHeader.replace("Bearer ", "");
            String uid = firebaseService.verifyTokenAndGetUid(token);

            // create new Authentication object and store in SecurityContext
            SecurityContextHolder.getContext().setAuthentication(new FirebaseAuthentication(uid));

            // continue filter chain flow
            filterChain.doFilter(request, response);
        } catch (FirebaseAuthException e) {
            // Token verification failed
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
