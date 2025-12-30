package com.server.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.dto.LoginRequest;
import com.server.backend.models.entities.User;
import com.server.backend.services.AuthService;
import com.server.backend.utils.ApiResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @Autowired
  private AuthService authService;

  @GetMapping("/get-user")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<User>> getUser(Authentication auth) {
    String email = auth.getName();
    User user = authService.getUserByEmail(email);
    System.out.println("Get user data for: " + user.getId());
    System.out.println("Get user data for: " + user.getUsername());
    return ResponseEntity.ok(new ApiResponse<>(true, "Get user data successfully", user));
  }

  @PostMapping("/login")
  public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginRequest loginRequest) {
    try {
      String token = authService.login(loginRequest);

      return ResponseEntity.ok(
          new ApiResponse<>(
              true,
              "Login successfully",
              token));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
          new ApiResponse<>(
              false,
              "Login: " + e.getMessage(), null));
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<ApiResponse<String>> signUp(@RequestBody User user) {
    try {
      String token = authService.register(user);

      return ResponseEntity.ok(
          new ApiResponse<>(
              true,
              "Register successfully",
              token));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(
          new ApiResponse<>(
              false,
              "Regiter: " + e.getMessage(), null));
    }
  }
}
