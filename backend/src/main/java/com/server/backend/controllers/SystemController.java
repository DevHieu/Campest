package com.server.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SystemController {

  // Because i use free hosting, i need to keep the server alive by using cron-job
  @GetMapping("/keepalive")
  public String keepAlive() {
    return "OK";
  }
}
