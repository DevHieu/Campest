import React from "react";
import styles from "./CampsiteResult.module.css";
import Rating from "@mui/material/Rating";

function CampsiteResult({ placeId, title, img, rating, address, handleSelect }) {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  const imgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${img}&key=${apiKey}`;
  return (
    <button className={styles.container} onClick={() => handleSelect(placeId)}>
      <img src={imgUrl} alt={title} className={styles.image} loading="lazy" />
      <div className={styles.info}>
        <h3>{title}</h3>
        <Rating value={rating} readOnly size="small" precision={0.5} />
        <p>{address}</p>
      </div>
    </button>
  );
}

export default CampsiteResult;
