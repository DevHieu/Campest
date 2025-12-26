package com.server.backend.models.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "CampsiteSaved")
@Data
@AllArgsConstructor
public class CampsiteSaved {
  @Id
  private String id;
  private String placeId;
  private String userId;
  private String name;
  private String image;
  private float rating;
  private String address;
}
