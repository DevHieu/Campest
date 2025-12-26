package com.server.backend.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
  public ResponseEntity<?> findCampsite(@PathVariable String place) {
    Map<String, Object> result = campsiteService.findCampsite(place);
    return ResponseEntity.ok(result);
  }

  @GetMapping("/get-place-details/{placeId}")
  public ResponseEntity<?> getPlaceDetails(@PathVariable String placeId) {
    return ResponseEntity.ok(campsiteService.placeDetails(placeId));
  }

  @GetMapping("/saved-campsites/{userId}")
  public ResponseEntity<ApiResponse<List<CampsiteSaved>>> getSaved(@PathVariable String userId) {
    List<CampsiteSaved> data = campsiteService.getSavedList(userId);
    return ResponseEntity.ok(
        new ApiResponse<>(true, "Get saved campsites successfully", data));
  }

  @PostMapping("/save-campsite")
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

  @DeleteMapping("/remove-campsite")
  public ResponseEntity<ApiResponse<Void>> remove(
      @RequestParam String userId,
      @RequestParam String placeId) {
    try {
      campsiteService.removeCampsite(userId, placeId);
      return ResponseEntity.ok(
          new ApiResponse<>(true, "Remove campsite successfully", null));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ApiResponse<>(false, e.getMessage(), null));
    }
  }

  @PostMapping("/add-campsite-to-itinerary/{itineraryId}")
  public ResponseEntity<ApiResponse<Void>> addToItinerary(
      @PathVariable String itineraryId,
      @RequestBody ItineraryDetail place) {

    campsiteService.addCampsiteToItinerary(itineraryId, place);

    return ResponseEntity.ok(
        new ApiResponse<>(true, "Campsite added to itinerary successfully", null));
  }

}
