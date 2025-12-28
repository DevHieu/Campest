import React, { useState, useEffect } from "react";
import styles from "./PlaceDetails.module.css";
import Loading from "../../Loading/index.jsx";

import PlaceIcon from "@mui/icons-material/Place";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { useAuth } from "../../../context/AuthProvider.jsx";
import { getPlaceDetail } from "../../../services/itineraryService.js";

export default function PlaceDetails({
  placeId,
  addToItinerary,
  deleteMarker,
  setItinerary,
  addedIndex,
}) {
  const [value, setValue] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdded = addedIndex !== -1;

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getPlaceDetail(placeId);

        setData(res.result);
      } catch (err) {
        console.error("Error get place detail:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (placeId) {
      fetchPlaceDetail();
    }
  }, [placeId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDelete = (index) => {
    setItinerary((prev) => {
      const deleteValue = [...prev];
      deleteValue.splice(index, 1);
      return deleteValue;
    });
    deleteMarker(index);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div className={styles.tab_wrapper} hidden={value !== index}>
        {value === index && children}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Box sx={{ width: "100%" }} className={styles.tabs_header}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={0}>
              <Tab label="Chi tiết" value={0} />
              <Tab label="Đánh giá" value={1} />
            </Tabs>
          </Box>
        </Box>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Box sx={{ width: "100%" }} className={styles.tabs_header}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Chi tiết" value={0} />
            <Tab label="Đánh giá" value={1} />
          </Tabs>
        </Box>
      </Box>
      <TabPanel value={value} index={0}>
        <div className={styles.detail_tab}>
          <h2 className={styles.place_name}>{data.name}</h2>

          <div className={styles.action_wrapper}>
            <button
              className={`${styles.action_btn} ${isAdded ? styles.added : ""}`}
              onClick={() => {
                if (isAdded) {
                  handleDelete(addedIndex);
                } else {
                  addToItinerary({ place: data });
                }
              }}
            >
              {isAdded ? "✓ Added" : "+ Add"}
            </button>

            <button
              className={styles.action_btn}
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/place/?q=place_id:${placeId}`,
                  "_blank"
                );
              }}
            >
              <PlaceIcon fontSize="small" />
              Xem thêm tại Maps
            </button>
          </div>

          <p className={styles.address}>📍 {data.formatted_address}</p>

          {data.formatted_phone_number && (
            <p>📞 {data.formatted_phone_number}</p>
          )}

          {data.website && (
            <p>
              🌐{" "}
              <a href={data.website} target="_blank" rel="noreferrer">
                {data.website}
              </a>
            </p>
          )}

          <p>
            ⭐ {data.rating} ({data.user_ratings_total} đánh giá)
          </p>

          {data.opening_hours?.weekday_text && (
            <div className={styles.opening_hours}>
              <h4>🕒 Giờ mở cửa</h4>
              {data.opening_hours.weekday_text.map((day, i) => (
                <p key={i}>{day}</p>
              ))}
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className={styles.review_tab}>
          {data.reviews?.length > 0 ? (
            data.reviews.map((review, i) => (
              <div key={i} className={styles.review_item}>
                <div className={styles.review_header}>
                  <strong>{review.author_name}</strong>
                  <span>⭐ {review.rating}</span>
                </div>
                <p className={styles.review_text}>{review.text}</p>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá.</p>
          )}
        </div>
      </TabPanel>
    </div>
  );
}
