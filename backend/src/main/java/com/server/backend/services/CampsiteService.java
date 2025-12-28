package com.server.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.backend.models.entities.CampsiteSaved;
import com.server.backend.repositories.CampsiteSavedRepository;

@Service
public class CampsiteService {

  @Autowired
  private CampsiteSavedRepository campsiteSavedRepo;

  public List<CampsiteSaved> getSavedList(String email) {
    System.out.println("Getting saved campsites for user: " + email);
    return campsiteSavedRepo.findByUserEmail(email);
  }

  public CampsiteSaved saveCampsite(CampsiteSaved entity) {
    if (entity == null || entity.getPlaceId() == null || entity.getUserEmail() == null) {
      throw new IllegalArgumentException("Invalid data");
    }

    if (campsiteSavedRepo.existsByUserEmailAndPlaceId(
        entity.getUserEmail(), entity.getPlaceId())) {
      throw new IllegalStateException("Campsite already saved");
    }

    return campsiteSavedRepo.save(entity);
  }

  public void removeCampsite(String email, String placeId) {
    if (!campsiteSavedRepo.existsByUserEmailAndPlaceId(email, placeId)) {
      throw new RuntimeException("Campsite not found");
    }
    campsiteSavedRepo.deleteByUserEmailAndPlaceId(email, placeId);
  }

}
