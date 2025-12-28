package com.server.backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.server.backend.models.entities.CampsiteSaved;

@Repository
public interface CampsiteSavedRepository extends MongoRepository<CampsiteSaved, String> {
  boolean existsByUserEmailAndPlaceId(String email, String placeId);

  void deleteByUserEmailAndPlaceId(String email, String placeId);

  List<CampsiteSaved> findByUserEmail(String email);

}
