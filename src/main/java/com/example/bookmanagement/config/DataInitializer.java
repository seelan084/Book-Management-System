package com.example.bookmanagement.config;

import com.example.bookmanagement.entity.User;
import com.example.bookmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin user exists
        if (!userRepository.findByUsername("badadmin").isPresent()) {
            System.out.println("Creating default admin user...");
            
            // Create roles set
            Set<String> roles = new HashSet<>();
            roles.add("USER");
            roles.add("ADMIN");

            // Create admin user
            User admin = User.builder()
                    .username("badadmin")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(roles)
                    .build();

            try {
                userRepository.save(admin);
                System.out.println("Default admin user created successfully!");
            } catch (Exception e) {
                System.err.println("Failed to create default admin user: " + e.getMessage());
            }
        }
    }
} 