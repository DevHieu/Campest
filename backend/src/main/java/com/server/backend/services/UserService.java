package com.server.backend.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.server.backend.dto.LoginRequest;
import com.server.backend.models.entities.User;
import com.server.backend.models.enums.UserEnum;
import com.server.backend.repositories.UserRepository;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AuthenticationManager authManager;

  @Autowired
  private JwtService jwtService;

  private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

  public String signIn(LoginRequest loginRequest) {
    Authentication authentication = authManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(),
            loginRequest.getPassword()));

    if (!authentication.isAuthenticated()) {
      throw new RuntimeException("Invalid username or password");
    }

    return jwtService.generateToken(loginRequest.getEmail());
  }

  public String register(User user) {
    if (userRepository.existsByEmail(user.getEmail())) {
      throw new RuntimeException("Email already exists");
    }

    user.setPassword(encoder.encode(user.getPassword()));
    user.setRole(UserEnum.USER);
    userRepository.save(user);

    return jwtService.generateToken(user.getEmail());
  }

  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }
}
