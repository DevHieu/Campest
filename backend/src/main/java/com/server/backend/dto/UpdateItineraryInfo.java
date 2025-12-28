package com.server.backend.dto;

import lombok.Data;

@Data
public class UpdateItineraryInfo {
  private String name;
  private String startDate;
  private String endDate;
  private String note;
  private String color;
}
