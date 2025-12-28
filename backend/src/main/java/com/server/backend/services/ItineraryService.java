package com.server.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.server.backend.dto.ItineraryDetail;
import com.server.backend.dto.ItinerarySummary;
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
        .orElseThrow(() -> new RuntimeException("Itinerary not found"));
  }

  public Page<ItinerarySummary> getUserItineraries(String email, Pageable pageable) {

    // 1️⃣ Query theo email
    Query query = new Query(
        Criteria.where("userId").is(email));

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
        Criteria.where("userId").is(email));
    long total = mongoTemplate.count(countQuery, "Itineraries");

    return new PageImpl<>(results, pageable, total);
  }

  public void createItinerary(Itinerary itinerary) {
    itineraryRepository.save(itinerary);
  }

  public void updateItineraryDetail(String id, ArrayList<ItineraryDetail> detail) {
    Query query = new Query(Criteria.where("_id").is(id));
    Update update = new Update().set("detail", detail);
    mongoTemplate.updateFirst(query, update, Itinerary.class);
  }

  public void updateItineraryInfo(String id, UpdateItineraryInfo info) {
    Query query = new Query(Criteria.where("_id").is(id));
    Update update = new Update()
        .set("name", info.getName())
        .set("startDate", info.getStartDate())
        .set("endDate", info.getEndDate())
        .set("note", info.getNote())
        .set("color", info.getColor());

    mongoTemplate.updateFirst(query, update, Itinerary.class);
  }

  public void deleteItinerary(String id) {
    itineraryRepository.deleteById(id);
  }

  public void addCampsiteToItinerary(String itineraryId, ItineraryDetail place) {
    Itinerary itinerary = itineraryRepository
        .findById(itineraryId)
        .orElseThrow(() -> new RuntimeException("Itinerary not found"));

    if (itinerary.getDetail() == null) {
      itinerary.setDetail(new ArrayList<>());
    }

    itinerary.getDetail().add(place);
    itineraryRepository.save(itinerary);
  }
}
