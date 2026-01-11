package com.ecommerce.auth_service.controller;

import com.ecommerce.auth_service.model.Role;
import com.ecommerce.auth_service.model.User;
import com.ecommerce.auth_service.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UsersController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> list() {
        return userRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> create(@RequestBody Map<String, Object> body) {
        String username = (String) body.getOrDefault("username", body.getOrDefault("name", "user" + System.currentTimeMillis()));
        String email = (String) body.getOrDefault("email", username + "@example.com");
        String rawPassword = (String) body.getOrDefault("password", "Password123!");
        String roleStr = (String) body.getOrDefault("role", "USER");
        Role role = "ADMIN".equalsIgnoreCase(roleStr) ? Role.ROLE_ADMIN : Role.ROLE_USER;

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .build();
        User saved = userRepository.save(user);
        return ResponseEntity.created(URI.create("/api/users/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return userRepository.findById(id)
                .map(u -> {
                    if (body.containsKey("username")) u.setUsername((String) body.get("username"));
                    if (body.containsKey("email")) u.setEmail((String) body.get("email"));
                    if (body.containsKey("password")) u.setPassword(passwordEncoder.encode((String) body.get("password")));
                    if (body.containsKey("role")) {
                        String roleStr = (String) body.get("role");
                        u.setRole("ADMIN".equalsIgnoreCase(roleStr) ? Role.ROLE_ADMIN : Role.ROLE_USER);
                    }
                    return ResponseEntity.ok(userRepository.save(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            // Minimal implementation: delete user to simulate deactivation
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
