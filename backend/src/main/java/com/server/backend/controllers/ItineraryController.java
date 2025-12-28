package com.server.backend.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.dto.ItineraryDetail;
import com.server.backend.dto.ItinerarySummary;
import com.server.backend.dto.UpdateItineraryInfo;
import com.server.backend.models.entities.Itinerary;
import com.server.backend.services.ItineraryService;
import com.server.backend.utils.ApiResponse;

@RestController
@RequestMapping("/user/itinerary")
public class ItineraryController {
  @Autowired
  private ItineraryService itineraryService;

  @PostMapping("/")
  public ResponseEntity<ApiResponse<Void>> createItinerary(@RequestBody Itinerary itinerary) {
    itineraryService.createItinerary(itinerary);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new ApiResponse<>(true, "Create itinerary successfully", null));
  }

  @GetMapping("/{itineraryId}")
  public ResponseEntity<ApiResponse<Itinerary>> getItineraryById(
      @PathVariable String itineraryId) {

    Itinerary itinerary = itineraryService.getItinerary(
        itineraryId);

    return ResponseEntity.ok(
        new ApiResponse<>(true, "OK", itinerary));
  }

  @GetMapping("")
  public ResponseEntity<ApiResponse<Page<ItinerarySummary>>> getUserItineraries(
      Authentication auth,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
    Page<ItinerarySummary> result = itineraryService.getUserItineraries(auth.getName(), pageable);

    return ResponseEntity.ok(
        new ApiResponse<>(true, "OK", result));
  }

  @PutMapping("/details/{id}")
  public ResponseEntity<ApiResponse<Void>> updateItineraryDetail(
      @PathVariable String id,
      @RequestBody ArrayList<ItineraryDetail> detail) {
    itineraryService.updateItineraryDetail(id, detail);
    return ResponseEntity.ok(new ApiResponse<>(true, "Updated detail", null));
  }

  @PutMapping("/info/{id}")
  public ResponseEntity<ApiResponse<Void>> updateItineraryInfo(
      @PathVariable String id,
      @RequestBody UpdateItineraryInfo info) {
    itineraryService.updateItineraryInfo(id, info);
    return ResponseEntity.ok(new ApiResponse<>(true, "Updated info", null));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteItinerary(@PathVariable String id) {
    itineraryService.deleteItinerary(id);
    return ResponseEntity.ok(new ApiResponse<>(true, "Deleted", null));
  }

  @PostMapping("{id}/details") // Add 1 place
  public ResponseEntity<ApiResponse<Void>> addToItinerary(
      @PathVariable String id,
      @RequestBody ItineraryDetail place) {

    itineraryService.addCampsiteToItinerary(id, place);

    return ResponseEntity.ok(
        new ApiResponse<>(true, "Campsite added to itinerary successfully", null));
  }

}
