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
  AuthenticationManager authManager;

  @Autowired
  private JwtService jwtService;

  private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

  public ResponseEntity<Map<String, Object>> signIn(LoginRequest loginRequest) {
    Map<String, Object> response = new HashMap<>();

    Authentication authentication = authManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

    if (authentication.isAuthenticated()) {
      response.put("message", "login successfully");
      response.put("status", 200); // 200 OK
      response.put("token", jwtService.generateToken(loginRequest.getEmail()));
      return ResponseEntity.status(HttpStatus.OK).body(response);
    } else {
      response.put("message", "Invalid username or password");
      response.put("status", 401); // 401 Unauthorized

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
  }

  public ResponseEntity<Map<String, Object>> register(User user) {
    Map<String, Object> response = new HashMap<>();
    if (userRepository.existsByEmail(user.getEmail())) {
      response.put("message", "email has already exists");
      response.put("status", 303); // HTTP 303 See Other
      return ResponseEntity.status(HttpStatus.SEE_OTHER).body(response);
    } else {
      user.setPassword(encoder.encode(user.getPassword()));
      user.setRole(UserEnum.USER);
      userRepository.save(user);
      response.put("message", "User registered successfully!");
      response.put("status", 201); // HTTP 201 Created
      response.put("token", jwtService.generateToken(user.getEmail()));
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
  }
}