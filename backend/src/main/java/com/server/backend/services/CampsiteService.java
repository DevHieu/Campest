package com.server.backend.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.server.backend.models.entities.CampsiteSaved;
import com.server.backend.repositories.CampsiteSavedRepository;

@Service
public class CampsiteService {

  @Autowired
  private GooglePlaceService googlePlaceService;

  @Autowired
  private CampsiteSavedRepository campsiteSavedRepo;

  private ResponseEntity<Map<String, Object>> handleGoogleApiResponse(String status, List<Map<String, Object>> results,
      Map<String, Object> rawResponse) {
    switch (status) {
      case "OK":
        if (results == null || results.isEmpty()) {
          return ResponseEntity.ok(
              Map.of(
                  "message", "Không tìm thấy campsite ở khu vực này",
                  "results", List.of()));
        }
        return ResponseEntity.ok(rawResponse);

      case "ZERO_RESULTS":
        Map<String, Object> noResult = Map.of(
            "message", "Không tìm thấy campsite nào ở khu vực bạn chọn",
            "suggestions", List.of(
                "Thử tìm kiếm với từ khóa khác",
                "Kiểm tra chính tả",
                "Thử tìm kiếm khu vực lân cận"));
        return ResponseEntity.ok(noResult);

      case "INVALID_REQUEST":
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Yêu cầu không hợp lệ"));

      case "OVER_QUERY_LIMIT":
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .body(Map.of("error", "Đã vượt quá giới hạn truy vấn"));

      default:
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Lỗi từ Google API: " + status));
    }
  }

  public ResponseEntity<Map<String, Object>> findCampsite(String place) {
    String query = "campsite+in+" + place;
    Map<String, Object> mapResult = googlePlaceService.textSearch(query);

    String status = (String) mapResult.get("status");
    @SuppressWarnings("unchecked")
    List<Map<String, Object>> results = (List<Map<String, Object>>) mapResult.get("results");

    // Check Google API status
    return handleGoogleApiResponse(status, results, mapResult);
  }

  public ResponseEntity<Map<String, Object>> placeDetails(String placeId) {
    Map<String, Object> placeDetails = googlePlaceService.getPlaceDetails(placeId);
    return ResponseEntity.ok(placeDetails);
  }

  public ResponseEntity<Map<String, Object>> saveCampsite(CampsiteSaved entity) {
    Map<String, Object> response = new HashMap<>();

    try {
      if (entity == null || entity.getPlaceId() == null || entity.getUserId() == null) {
        response.put("message", "Invalid data");
        return ResponseEntity.badRequest().body(response);
      }

      if (campsiteSavedRepo.existsByUserIdAndPlaceId(
          entity.getUserId(), entity.getPlaceId())) {

        response.put("message", "Campsite already saved");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
      }

      CampsiteSaved saved = campsiteSavedRepo.save(entity);

      response.put("message", "Save campsite successfully!");
      response.put("data", saved);

      return ResponseEntity.status(HttpStatus.CREATED).body(response);

    } catch (Exception e) {
      response.put("message", "Save campsite failed");
      response.put("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

  }

  public ResponseEntity<Map<String, Object>> removeCampsite(String userId, String placeId) {
    Map<String, Object> response = new HashMap<>();

    try {
      if (userId == null || placeId == null) {
        response.put("message", "Invalid data");
        return ResponseEntity.badRequest().body(response);
      }

      if (!campsiteSavedRepo.existsByUserIdAndPlaceId(userId, placeId)) {
        response.put("message", "Campsite not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
      }

      campsiteSavedRepo.deleteByUserIdAndPlaceId(userId, placeId);

      return ResponseEntity.noContent().build();

    } catch (Exception e) {
      response.put("message", "Remove campsite failed");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }

  public ResponseEntity<Map<String, Object>> getSavedList(String userId) {
    Map<String, Object> response = new HashMap<>();

    try {
      List<CampsiteSaved> data = campsiteSavedRepo.findByUserId(userId);
      response.put("data", data);
      response.put("message", "Get campsite save list successfully");
      return ResponseEntity.status(HttpStatus.OK).body(response);
    } catch (Exception e) {
      response.put("message", "Get campsite save list failed");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }
}
