package com.ecommerce.auth_service.controller;

import com.ecommerce.auth_service.dto.AuthRequest;
import com.ecommerce.auth_service.dto.AuthResponse;
import com.ecommerce.auth_service.dto.RegisterRequest;
import com.ecommerce.auth_service.model.Role;
import com.ecommerce.auth_service.security.JwtService;
import com.ecommerce.auth_service.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody RegisterRequest request,
                         @RequestParam(defaultValue = "USER") String role) {
        Role r = "ADMIN".equalsIgnoreCase(role) ? Role.ROLE_ADMIN : Role.ROLE_USER;
        authService.register(request, r);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails user = (UserDetails) auth.getPrincipal();
        String username = user.getUsername();
        String role = user.getAuthorities().stream().findFirst().map(Object::toString).orElse("ROLE_USER");
        String token = ""; // Typically client holds token; we can return empty here
        return ResponseEntity.ok(new AuthResponse(token, username, Role.valueOf(role)));
    }
}
