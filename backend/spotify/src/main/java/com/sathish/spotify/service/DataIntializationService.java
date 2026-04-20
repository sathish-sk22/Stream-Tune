package com.sathish.spotify.service;

import com.sathish.spotify.Document.User;
import com.sathish.spotify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataIntializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createDefaultAdminUser();
    }

    private void createDefaultAdminUser(){
        if(!userRepository.existsByEmail("admin@spotify.com")){
            User adminUser=User.builder()
                    .email("admin@spotify.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();

            userRepository.save(adminUser);
            log.info("Default adminUser created :email=admin@spotify.com,password=admin123");
;        }else{
            log.info("Admin user already exists");
        }
    }
}
