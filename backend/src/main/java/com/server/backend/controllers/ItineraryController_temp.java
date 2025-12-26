package com.server.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.dto.ItinerarySummary;
import com.server.backend.dto.UpdateItineraryDetail;
import com.server.backend.dto.UpdateItineraryInfo;
import com.server.backend.models.entities.Itinerary;
import com.server.backend.services.ItineraryService;
import com.server.backend.utils.ApiResponse;

@RestController
@RequestMapping("/itinerary")
public class ItineraryController_temp {

  @Autowired
  private ItineraryService itineraryService;

  @PostMapping("/create-itinerary")
  public ResponseEntity<ApiResponse<Void>> createItinerary(@RequestBody Itinerary itinerary) {
    itineraryService.createItinerary(itinerary);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new ApiResponse<>(true, "Create itinerary successfully", null));
  }

  @GetMapping("/get-itinerary/{id}")
  public ResponseEntity<ApiResponse<Itinerary>> getItinerary(@PathVariable String id) {
    return ResponseEntity.ok(
        new ApiResponse<>(true, "OK", itineraryService.getItinerary(id)));
  }

  @GetMapping("/get-user-itineraries/{userId}")
  public ResponseEntity<ApiResponse<Page<ItinerarySummary>>> getUserItineraries(
      @PathVariable String userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
    Page<ItinerarySummary> result = itineraryService.getUserItineraries(userId, pageable);

    return ResponseEntity.ok(
        new ApiResponse<>(true, "OK", result));
  }

  @PutMapping("/update-itinerary-detail")
  public ResponseEntity<ApiResponse<Void>> updateItineraryDetail(
      @RequestBody UpdateItineraryDetail dto) {
    itineraryService.updateItineraryDetail(dto);
    return ResponseEntity.ok(new ApiResponse<>(true, "Updated detail", null));
  }

  @PutMapping("/update-itinerary-info")
  public ResponseEntity<ApiResponse<Void>> updateItineraryInfo(
      @RequestBody UpdateItineraryInfo dto) {
    itineraryService.updateItineraryInfo(dto);
    return ResponseEntity.ok(new ApiResponse<>(true, "Updated info", null));
  }

  @DeleteMapping("/delete-itinerary/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteItinerary(@PathVariable String id) {
    itineraryService.deleteItinerary(id);
    return ResponseEntity.ok(new ApiResponse<>(true, "Deleted", null));
  }

  @GetMapping("/search-places")
  public ResponseEntity<ApiResponse<Map<String, Object>>> searchPlaces(
      @RequestParam String search,
      @RequestParam double lat,
      @RequestParam double lng) {

    return ResponseEntity.ok(
        new ApiResponse<>(true, "OK",
            itineraryService.searchPlaces(search, lat, lng)));
  }

  @GetMapping("/get-place-details/{placeId}")
  public ResponseEntity<ApiResponse<Map<String, Object>>> getPlaceDetails(
      @PathVariable String placeId) {

    return ResponseEntity.ok(
        new ApiResponse<>(true, "OK", itineraryService.getPlaceDetails(placeId)));
  }
}
