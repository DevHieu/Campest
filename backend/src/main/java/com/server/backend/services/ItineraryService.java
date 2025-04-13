package com.server.backend.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.server.backend.dto.ItinerarySummary;
import com.server.backend.dto.UpdateItineraryDetail;
import com.server.backend.dto.UpdateItineraryInfo;
import com.server.backend.models.entities.Itinerary;
import com.server.backend.repositories.ItineraryRepository;

@Service
public class ItineraryService {

  @Autowired
  private ItineraryRepository itineraryRepository;

  @Autowired
  private MongoTemplate mongoTemplate;

  public Itinerary getItinerary(String id) {
    return itineraryRepository.findById(id)
        .orElse(null);
  }

  public Page<ItinerarySummary> getAllItineraries(Pageable pageable) {
    Query query = new Query();
    query.fields()
        .include("id")
        .include("name")
        .include("startDate")
        .include("endDate");

    List<ItinerarySummary> results = mongoTemplate.find(query, ItinerarySummary.class, "Itineraries");
    long total = mongoTemplate.count(new Query(), "Itineraries"); // ← đếm tổng document (không phân trang)

    return new PageImpl<ItinerarySummary>(results, pageable, total);
  }

  public ResponseEntity<Map<String, Object>> createItinerary(Itinerary itinerary) {
    Map<String, Object> response = new HashMap<>();
    itineraryRepository.save(itinerary);
    response.put("message", "create new itinerary successfully!");
    response.put("status", 201); // HTTP 201 Created
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  public void updateItineraryDetail(UpdateItineraryDetail updateItineraryDetail) {
    Query query = new Query(Criteria.where("_id").is(updateItineraryDetail.getId()));

    Update update = new Update();
    update.set("detail", updateItineraryDetail.getDetail());

    mongoTemplate.updateFirst(query, update, Itinerary.class);
  }

  public void updateItineraryInfo(UpdateItineraryInfo updateItineraryInfo) {
    Query query = new Query(Criteria.where("_id").is(updateItineraryInfo.getId()));

    Update update = new Update();
    update.set("name", updateItineraryInfo.getName());
    update.set("startDate", updateItineraryInfo.getStartDate());
    update.set("endDate", updateItineraryInfo.getEndDate());
    update.set("note", updateItineraryInfo.getNote());
    update.set("color", updateItineraryInfo.getColor());

    mongoTemplate.updateFirst(query, update, Itinerary.class);
  }

  public void deleteItinerary(String id) {
    itineraryRepository.deleteById(id);
  }
}
