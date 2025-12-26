package com.server.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.backend.dto.ItineraryDetail;
import com.server.backend.models.entities.CampsiteSaved;
import com.server.backend.models.entities.Itinerary;
import com.server.backend.repositories.CampsiteSavedRepository;
import com.server.backend.repositories.ItineraryRepository;

@Service
public class CampsiteService {

  @Autowired
  private GooglePlaceService googlePlaceService;

  @Autowired
  private CampsiteSavedRepository campsiteSavedRepo;

  @Autowired
  private ItineraryRepository itineraryRepo;

  public Map<String, Object> findCampsite(String place) {
    String query = "campsite+in+" + place;
    return googlePlaceService.textSearch(query);
  }

  public Map<String, Object> placeDetails(String placeId) {
    return googlePlaceService.getPlaceDetails(placeId);
  }

  public List<CampsiteSaved> getSavedList(String userId) {
    return campsiteSavedRepo.findByUserId(userId);
  }

  public CampsiteSaved saveCampsite(CampsiteSaved entity) {
    if (entity == null || entity.getPlaceId() == null || entity.getUserId() == null) {
      throw new IllegalArgumentException("Invalid data");
    }

    if (campsiteSavedRepo.existsByUserIdAndPlaceId(
        entity.getUserId(), entity.getPlaceId())) {
      throw new IllegalStateException("Campsite already saved");
    }

    return campsiteSavedRepo.save(entity);
  }

  public void removeCampsite(String userId, String placeId) {
    if (!campsiteSavedRepo.existsByUserIdAndPlaceId(userId, placeId)) {
      throw new RuntimeException("Campsite not found");
    }
    campsiteSavedRepo.deleteByUserIdAndPlaceId(userId, placeId);
  }

  public void addCampsiteToItinerary(String itineraryId, ItineraryDetail place) {
    Itinerary itinerary = itineraryRepo
        .findById(itineraryId)
        .orElseThrow(() -> new RuntimeException("Itinerary not found"));

    if (itinerary.getDetail() == null) {
      itinerary.setDetail(new ArrayList<>());
    }

    itinerary.getDetail().add(place);
    itineraryRepo.save(itinerary);
  }
}
