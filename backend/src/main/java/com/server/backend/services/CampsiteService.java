package com.server.backend.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CampsiteService {

  @Value("${google.places.api.key}")
  private String apiKey;
  private final WebClient webClient;

  public CampsiteService() {
    this.webClient = WebClient.builder()
        .baseUrl("https://maps.googleapis.com/maps/api/place")
        .build();
  }

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
    return webClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/textsearch/json")
            .queryParam("query", query)
            .queryParam("key", apiKey)
            .build())
        .retrieve()
        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
        })
        .block();
  }

  // Return details of a campsite based on the place id
  public Map<String, Object> getPlaceDetails(String placeId) {
    return webClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/details/json")
            .queryParam("place_id", placeId)
            .queryParam("key", apiKey)
            .build())
        .retrieve()
        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
        })
        .block();
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
    Map<String, Object> placeDetails = this.getPlaceDetails(placeId);
    placeDetails.forEach((k, v) -> System.out.println(k + " : " + v));
    return ResponseEntity.ok(placeDetails);
  }

}
