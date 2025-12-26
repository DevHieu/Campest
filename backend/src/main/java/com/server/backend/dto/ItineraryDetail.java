package com.server.backend.dto;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ItineraryDetail {
  @Id
  private String id;
  private String place_id;
  private String name;
  private String notes;
  private String latitude;
  private String longitude;
}
