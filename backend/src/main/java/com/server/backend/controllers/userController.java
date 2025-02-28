package com.server.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.dto.LoginRequest;
import com.server.backend.models.entities.User;
import com.server.backend.repositories.UserRepository;
import com.server.backend.services.JwtService;
import com.server.backend.services.UserService;

@RestController
public class userController {

  @Autowired
  private UserService userService;

  @Autowired
  private JwtService jwtService;

  private final UserRepository userRepository;

  @Autowired
  public userController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/get-user")
  public User getUser(@RequestHeader("Authorization") String token) {
    String jwt = token.substring(7);
    String email = jwtService.extractUserName(jwt);
    return userRepository.findByEmail(email);
  }

  @PostMapping("/signin")
  public ResponseEntity<Map<String, Object>> signIn(@RequestBody LoginRequest loginRequest) {
    return userService.signIn(loginRequest);
  }

  @PostMapping("/signup")
  public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
    return userService.register(user);
  }
}
