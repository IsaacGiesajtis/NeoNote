package com.neonote.neonote.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

// Coded by Thomas Dickson
@EnableWebSecurity
@Configuration
public class SecurityConfig {
    private final FirebaseFilter firebaseFilter;

    @Autowired
    public SecurityConfig(FirebaseFilter firebaseFilter) {
        this.firebaseFilter = firebaseFilter;
    }

    @Bean
    @Order(SecurityProperties.BASIC_AUTH_ORDER)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .authorizeHttpRequests(auth -> auth
                        .anyRequest()
                        .authenticated()) // require authorization on all requests
                .addFilterBefore(firebaseFilter, BasicAuthenticationFilter.class) // add custom firebase filter to START of chain
                .httpBasic(Customizer.withDefaults()) // allow http
                .csrf(AbstractHttpConfigurer::disable); // disable csrf protection

        return http.build(); // build chain
    }
}
