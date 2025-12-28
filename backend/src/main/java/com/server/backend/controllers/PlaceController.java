package com.server.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.services.GooglePlaceService;
import com.server.backend.utils.ApiResponse;

@RestController
@RequestMapping("/public/place")
public class PlaceController {

  @Autowired
  private GooglePlaceService placeService;

  @GetMapping("/nearby")
  public ResponseEntity<ApiResponse<Map<String, Object>>> searchPlaces(
      @RequestParam String search,
      @RequestParam double lat,
      @RequestParam double lng) {

    return ResponseEntity.ok(
        new ApiResponse<>(true, "OK",
            placeService.textSearch(search, lat, lng)));
  }

  @GetMapping("/search")
  public ResponseEntity<?> findCampsite(@RequestParam String query) {
    Map<String, Object> result = placeService.textSearch("campsite+in+" + query); // ("campsite+in+" + place) để search
                                                                                  // là các khu cắm trại
    return ResponseEntity.ok(result);
  }

  @GetMapping("/{placeId}")
  public ResponseEntity<?> getPlaceDetails(@PathVariable String placeId) {
    return ResponseEntity.ok(placeService.getPlaceDetails(placeId));
  }
}
