package com.server.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.models.entities.User;
import com.server.backend.repositories.UserRepository;

@RestController
@RequestMapping("/auth")
public class authController {

  private final UserRepository userRepository;

  public authController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/login")
  public String getPassword() {
    return "Hi, welcome";
  }

  // @GetMapping("/csrf-token")
  // public CsrfToken getCsrfToken(HttpServletRequest request) {
  // return (CsrfToken) request.getAttribute("_csrf");
  // }

  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
    System.out.println("DEBUG: Username = " + user.getUsername());
    if (userRepository.existsByEmail(user.getEmail())) {
      Map<String, Object> response = new HashMap<>();
      response.put("message", "email has already exists");
      response.put("status", 303); // HTTP 303 See Other

      return ResponseEntity.status(HttpStatus.SEE_OTHER).body(response);
    } else {
      BCryptPasswordEncoder hashPass = new BCryptPasswordEncoder();
      user.setPassword(hashPass.encode(user.getPassword()));
      userRepository.save(user);
      Map<String, Object> response = new HashMap<>();
      response.put("message", "User registered successfully!");
      response.put("status", 201); // HTTP 201 Created

      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
  }
}
