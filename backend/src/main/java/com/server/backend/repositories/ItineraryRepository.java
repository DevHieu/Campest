package com.server.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.server.backend.models.entities.Itinerary;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, String> {

}
