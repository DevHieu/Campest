package com.server.backend.dto;

import java.util.ArrayList;

import lombok.Data;

@Data
public class UpdateItineraryDetail {
  private String id;
  private ArrayList<ItineraryDetail> detail;
}
