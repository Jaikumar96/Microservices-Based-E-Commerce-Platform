package com.example.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Set allowed origin
        corsConfig.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));

        // Set allowed methods
        corsConfig.setAllowedMethods(Collections.unmodifiableList(
                java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
        ));

        // Set allowed headers
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));

        // Allow credentials
        corsConfig.setAllowCredentials(true);

        // Set max age
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
