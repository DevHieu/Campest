package com.server.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.models.entities.CampsiteSaved;
import com.server.backend.services.CampsiteService;
import com.server.backend.utils.ApiResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/user/campsites")
public class campsiteController {

  @Autowired
  private CampsiteService campsiteService;

  @GetMapping("/saved")
  public ResponseEntity<ApiResponse<List<CampsiteSaved>>> getSaved(Authentication auth) {
    System.out.println("Getting saved campsites for user: " + auth.getName());
    List<CampsiteSaved> data = campsiteService.getSavedList(auth.getName());
    return ResponseEntity.ok(
        new ApiResponse<>(true, "Get saved campsites successfully", data));
  }

  @PostMapping("/")
  public ResponseEntity<ApiResponse<CampsiteSaved>> save(@RequestBody CampsiteSaved entity) {
    try {
      CampsiteSaved saved = campsiteService.saveCampsite(entity);
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(new ApiResponse<>(true, "Save campsite successfully", saved));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse<>(false, e.getMessage(), null));
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(new ApiResponse<>(false, e.getMessage(), null));
    }
  }

  @DeleteMapping("/{placeId}")
  public ResponseEntity<ApiResponse<Void>> remove(
      Authentication auth,
      @PathVariable String placeId) {
    try {
      campsiteService.removeCampsite(auth.getName(), placeId);
      return ResponseEntity.ok(
          new ApiResponse<>(true, "Remove campsite successfully", null));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ApiResponse<>(false, e.getMessage(), null));
    }
  }

}
