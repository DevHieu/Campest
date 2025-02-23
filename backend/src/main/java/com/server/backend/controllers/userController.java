package com.server.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.models.entities.User;
import com.server.backend.repositories.UserRepository;

@RestController
public class userController {

  private final UserRepository userRepository;

  @Autowired
  public userController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/get-user")
  public List<User> getUser() {
    return userRepository.findAll();
  }

}
