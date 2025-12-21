package com.server.backend.controllers;

import java.util.Map;

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

import com.server.backend.dto.ItinerarySummary;
import com.server.backend.dto.UpdateItineraryDetail;
import com.server.backend.dto.UpdateItineraryInfo;
import com.server.backend.models.entities.Itinerary;
import com.server.backend.services.ItineraryService;

@RestController
public class itineraryController {

  @Autowired
  private ItineraryService itineraryService;

  @PostMapping("itinerary/create-itinerary")
  public void createItinerary(@RequestBody Itinerary itinerary) {
    itineraryService.createItinerary(itinerary);
  }

  @GetMapping("itinerary/get-itinerary/{id}")
  public Itinerary getItinerary(
      @PathVariable String id) {
    return itineraryService.getItinerary(id);
  }

  @GetMapping("itinerary/get-user-itineraries/{userId}")
  public Page<ItinerarySummary> getUserItineraries(@PathVariable String userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
    return itineraryService.getUserItineraries(userId, pageable);
  }

  @PutMapping("itinerary/update-itinerary-detail")
  public void updateItineraryDetail(@RequestBody UpdateItineraryDetail updateItineraryDetail) {
    itineraryService.updateItineraryDetail(updateItineraryDetail);
  }

  @PutMapping("itinerary/update-itinerary-info")
  public void updateItineraryInfo(@RequestBody UpdateItineraryInfo updateItineraryInfo) {
    itineraryService.updateItineraryInfo(updateItineraryInfo);
  }

  @DeleteMapping("itinerary/delete-itinerary/{id}")
  public void deleteItinerary(@PathVariable String id) {
    itineraryService.deleteItinerary(id);
  }

  @GetMapping("itinerary/search-places")
  public Map<String, Object> searchPlaces(@RequestParam String search, @RequestParam double lat,
      @RequestParam double lng) {
    return itineraryService.searchPlaces(search, lat, lng);
  }

  @GetMapping("itinerary/get-place-detail")
  public Map<String, Object> getPlaceDetails(@RequestParam String placeId) {
    return itineraryService.getPlaceDetails(placeId);
  }

}
