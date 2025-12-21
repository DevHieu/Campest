package com.server.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.services.CampsiteService;

@RestController
public class campsiteController {

  @Autowired
  private CampsiteService campsiteService;

  @GetMapping("/find-campsite/{place}")
  public ResponseEntity<Map<String, Object>> findCampsite(@PathVariable String place) {
    return campsiteService.findCampsite(place);
  }

  @GetMapping("/get-place-details/{placeId}")
  public ResponseEntity<Map<String, Object>> getPlaceDetails(@PathVariable String placeId) {
    return campsiteService.placeDetails(placeId);
  }
}
