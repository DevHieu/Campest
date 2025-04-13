import React, { useState, useEffect } from "react";
import styles from "./MapMarker.module.css";
const MapMarker = ({ index, color, id }) => {
  return (
    <div
      className={styles.marker}
      style={{ backgroundColor: color }}
      data-marker-id={id}
    >
      <div>{index + 1}</div>
    </div>
  );
};

export default MapMarker;
