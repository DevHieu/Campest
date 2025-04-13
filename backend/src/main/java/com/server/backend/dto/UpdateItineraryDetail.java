package com.server.backend.dto;

import java.util.ArrayList;

import com.server.backend.models.entities.ItineraryDetail;

import lombok.Data;

@Data
public class UpdateItineraryDetail {
  private String id;
  private ArrayList<ItineraryDetail> detail;
}
