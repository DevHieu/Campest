package com.server.backend.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GooglePlaceService {

  @Value("${google.places.api.key}")
  private String apiKey;

  private final WebClient webClient;

  public GooglePlaceService() {
    this.webClient = WebClient.builder()
        .baseUrl("https://maps.googleapis.com/maps/api/place")
        .build();
  }

  public Map<String, Object> autocompletePlace(String query) {
    return webClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/autocomplete/json")
            .queryParam("input", query)
            .queryParam("key", apiKey)
            .build())
        .retrieve()
        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
        })
        .block();
  }

  public Map<String, Object> textSearch(String query, double lat, double lng) {
    return webClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/textsearch/json")
            .queryParam("query", query)
            .queryParam("location", lat + "," + lng)
            .queryParam("radius", 5000)
            .queryParam("key", apiKey)
            .build())
        .retrieve()
        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
        })
        .block();
  }

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
}
