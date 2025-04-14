package com.server.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.backend.dto.UpdateItineraryDetail;
import com.server.backend.dto.UpdateItineraryInfo;
import com.server.backend.dto.ItinerarySummary;
import com.server.backend.models.entities.Itinerary;
import com.server.backend.services.ItineraryService;

@RestController
public class itineraryController {

  @Autowired
  private ItineraryService itineraryService;

  @PostMapping("/create-itinerary")
  public void createItinerary(@RequestBody Itinerary itinerary) {
    itineraryService.createItinerary(itinerary);
  }

  @GetMapping("/get-itinerary/{id}")
  public Itinerary getItinerary(
      @PathVariable String id) {
    return itineraryService.getItinerary(id);
  }

  @GetMapping("/itineraries/{userId}")
  public Page<ItinerarySummary> getItinerary(@PathVariable String userId, @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
    return itineraryService.getUserItineraries(userId, pageable);
  }

  @PutMapping("/update-itinerary-detail")
  public void updateItineraryDetail(@RequestBody UpdateItineraryDetail updateItineraryDetail) {
    itineraryService.updateItineraryDetail(updateItineraryDetail);
  }

  @PutMapping("/update-itinerary-info")
  public void updateItineraryInfo(@RequestBody UpdateItineraryInfo updateItineraryInfo) {
    itineraryService.updateItineraryInfo(updateItineraryInfo);
  }

  @DeleteMapping("/delete-itinerary/{id}")
  public void deleteItinerary(@PathVariable String id) {
    itineraryService.deleteItinerary(id);
  }
}
