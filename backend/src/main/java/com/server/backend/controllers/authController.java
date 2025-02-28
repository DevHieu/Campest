package com.server.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.repositories.UserRepository;

@RestController
@RequestMapping("/auth")
public class authController {

  private final UserRepository userRepository;

  public authController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

}
