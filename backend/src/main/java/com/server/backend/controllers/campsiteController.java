package com.server.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.dto.ItineraryDetail;
import com.server.backend.models.entities.CampsiteSaved;
import com.server.backend.services.CampsiteService;
import com.server.backend.utils.ApiResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/campsite")
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

  @GetMapping("/saved-campsites/{userId}")
  public ResponseEntity<Map<String, Object>> getMethodName(@PathVariable String userId) {
    return campsiteService.getSavedList(userId);
  }

  @PostMapping("/save-campsite")
  public ResponseEntity<Map<String, Object>> saveCampsite(@RequestBody CampsiteSaved entity) {
    return campsiteService.saveCampsite(entity);
  }

  @DeleteMapping("/remove-campsite")
  public ResponseEntity<Map<String, Object>> removeCampsite(@RequestParam String userId, @RequestParam String placeId) {
    return campsiteService.removeCampsite(userId, placeId);
  }

  @PostMapping("/add-campsite-to-itinerary/{itineraryId}")
  public ResponseEntity<ApiResponse<Void>> postMethodName(@PathVariable String itineraryId,
      @RequestBody ItineraryDetail place) {
    campsiteService.addCampsiteToItinerary(itineraryId, place);

    return ResponseEntity.ok(
        new ApiResponse<>(true, "Campsite added to itinerary successfully", null));
  }

}
