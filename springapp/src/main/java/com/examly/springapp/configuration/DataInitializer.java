package com.examly.springapp.configuration;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Role;
import com.examly.springapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Create admin
                User admin = new User();
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);

                // Reviewer
                User reviewer = new User();
                reviewer.setEmail("reviewer@example.com");
                reviewer.setPassword(passwordEncoder.encode("reviewer123"));
                reviewer.setRole(Role.REVIEWER);
                userRepository.save(reviewer);

                // Inspector
                User inspector = new User();
                inspector.setEmail("inspector@example.com");
                inspector.setPassword(passwordEncoder.encode("inspector123"));
                inspector.setRole(Role.INSPECTOR);
                userRepository.save(inspector);

                // Vendor
                User vendor = new User();
                vendor.setEmail("vendor@example.com");
                vendor.setPassword(passwordEncoder.encode("vendor123"));
                vendor.setRole(Role.VENDOR);
                userRepository.save(vendor);

                // Super Admin
                User superAdmin = new User();
                superAdmin.setEmail("superadmin@example.com");
                superAdmin.setPassword(passwordEncoder.encode("superadmin123"));
                superAdmin.setRole(Role.SUPER_ADMIN);
                userRepository.save(superAdmin);
            }
        };
    }
}
