package com.server.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.dto.LoginRequest;
import com.server.backend.models.entities.User;
import com.server.backend.services.JwtService;
import com.server.backend.services.UserService;

@RestController
public class UserController_temp {

  @Autowired
  private UserService userService;

  @Autowired
  private JwtService jwtService;

  @GetMapping("/get-user")
  public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token) {
    String jwt = token.substring(7);
    String email = jwtService.extractUserName(jwt);

    User user = userService.getUserByEmail(email);

    return ResponseEntity.ok(
        Map.of(
            "success", true,
            "data", user));
  }

  @PostMapping("/signin")
  public ResponseEntity<?> signIn(@RequestBody LoginRequest loginRequest) {
    try {
      String token = userService.signIn(loginRequest);

      return ResponseEntity.ok(
          Map.of(
              "success", true,
              "message", "Login successfully",
              "token", token));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
          Map.of(
              "success", false,
              "message", e.getMessage()));
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signUp(@RequestBody User user) {
    try {
      String token = userService.register(user);

      return ResponseEntity.status(HttpStatus.CREATED).body(
          Map.of(
              "success", true,
              "message", "Register successfully",
              "token", token));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(
          Map.of(
              "success", false,
              "message", e.getMessage()));
    }
  }
}
