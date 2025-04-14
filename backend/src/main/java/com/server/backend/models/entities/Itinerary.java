package com.server.backend.models.entities;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Document(collection = "Itineraries")
@Getter
@AllArgsConstructor
public class Itinerary {
  @Id
  private String id;
  private String userId; // connect to user
  private String name;
  private String startDate;
  private String endDate;
  private String latitude;
  private String longitude;
  private String note;
  private ArrayList<ItineraryDetail> detail;
  private String color;
}
