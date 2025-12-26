package com.server.backend.services;

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

  @Autowired
  private GooglePlaceService googlePlaceService;

  public Itinerary getItinerary(String id) {
    return itineraryRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Itinerary not found"));
  }

  public Page<ItinerarySummary> getUserItineraries(String userId, Pageable pageable) {

    // 1️⃣ Query theo userId
    Query query = new Query(
        Criteria.where("userId").is(userId));

    // 2️⃣ Sort + skip + limit (pagination chuẩn)
    query.with(pageable);

    // 3️⃣ Chỉ lấy field cần thiết
    query.fields()
        .include("id")
        .include("place_id")
        .include("name")
        .include("startDate")
        .include("endDate");

    // 4️⃣ Lấy data
    List<ItinerarySummary> results = mongoTemplate.find(query, ItinerarySummary.class, "Itineraries");

    // 5️⃣ Count đúng điều kiện (KHÔNG phân trang)
    Query countQuery = new Query(
        Criteria.where("userId").is(userId));
    long total = mongoTemplate.count(countQuery, "Itineraries");

    return new PageImpl<>(results, pageable, total);
  }

  public void createItinerary(Itinerary itinerary) {
    itineraryRepository.save(itinerary);
  }

  public void updateItineraryDetail(UpdateItineraryDetail dto) {
    Query query = new Query(Criteria.where("_id").is(dto.getId()));
    Update update = new Update().set("detail", dto.getDetail());
    mongoTemplate.updateFirst(query, update, Itinerary.class);
  }

  public void updateItineraryInfo(UpdateItineraryInfo dto) {
    Query query = new Query(Criteria.where("_id").is(dto.getId()));
    Update update = new Update()
        .set("name", dto.getName())
        .set("startDate", dto.getStartDate())
        .set("endDate", dto.getEndDate())
        .set("note", dto.getNote())
        .set("color", dto.getColor());

    mongoTemplate.updateFirst(query, update, Itinerary.class);
  }

  public void deleteItinerary(String id) {
    itineraryRepository.deleteById(id);
  }

  public Map<String, Object> searchPlaces(String query, double lat, double lng) {
    return googlePlaceService.textSearch(query, lat, lng);
  }

  public Map<String, Object> getPlaceDetails(String placeId) {
    return googlePlaceService.getPlaceDetails(placeId);
  }
}
