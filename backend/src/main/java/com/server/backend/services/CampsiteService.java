package com.server.backend.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CampsiteService {

  @Autowired
  private GooglePlaceService googlePlaceService;

  private ResponseEntity<Map<String, Object>> handleGoogleApiResponse(String status, List<Map<String, Object>> results,
      Map<String, Object> rawResponse) {
    switch (status) {
      case "OK":
        if (results == null || results.isEmpty()) {
          return ResponseEntity.notFound().build();
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

  // Return a map of places based on the search query
  public Map<String, Object> searchPlaces(String place) {
    String query = "campsite+in+" + place;
    return googlePlaceService.autocompletePlace(query);
  }

  public ResponseEntity<Map<String, Object>> findCampsite(String place) {
    Map<String, Object> mapResult = this.searchPlaces(place);

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

}
