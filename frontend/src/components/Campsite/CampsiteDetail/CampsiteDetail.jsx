import Rating from "@mui/material/Rating";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LanguageIcon from "@mui/icons-material/Language";

import CommentItem from "../../CommentItem";
import Loading from "../../Loading";

import styles from "./CampsiteDetail.module.css";
import {
  saveCampsite,
  removeCampsite,
} from "../../../services/campsiteService";
import { useAuth } from "../../../context/AuthProvider";

export default function CampsiteDetail({
  placeSelected,
  loading,
  apiKey,
  isSaved,
  setSavedList,
}) {
  const { user } = useAuth();
  const handleSavePlace = () => {
    console.log(placeSelected);
    const sampsiteData = {
      userId: user.id,
      placeId: placeSelected.place_id,
      name: placeSelected.name,
      address: placeSelected.formatted_address,
      rating: placeSelected.rating.toFixed(1),
      image:
        placeSelected.photos && placeSelected.photos.length > 0
          ? placeSelected.photos[0].photo_reference
          : null,
    };

    try {
      saveCampsite(sampsiteData);
      setSavedList((prev) => [...prev, sampsiteData]);
    } catch (error) {
      console.log(error);
      console.log("Error saving campsite");
    }
  };

  const handleRemovePlace = async () => {
    try {
      await removeCampsite(user.id, placeSelected.place_id);

      setSavedList((prev) =>
        prev.filter((item) => item.placeId !== placeSelected.place_id)
      );
    } catch (error) {
      console.log("Error removing campsite", error);
    }
  };

  if (loading) return <Loading />;

  if (!placeSelected)
    return (
      <div className={styles.waiting}>
        <h2>Hãy tìm và chọn một bãi cắm trại</h2>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src={
            placeSelected?.photos?.[0]?.photo_reference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeSelected.photos[0].photo_reference}&key=${apiKey}`
              : ""
          }
          alt={placeSelected.name}
        />
        <div className={styles.info}>
          <h1>{placeSelected.name}</h1>
          <Rating
            value={placeSelected.rating}
            readOnly
            size="medium"
            precision={0.5}
          />
          <p>{placeSelected.types?.join(", ")}</p>
        </div>
      </div>

      <hr />

      <div className={styles.detail}>
        <h2>Chi tiết</h2>
        <ul className={styles.detail_list}>
          {placeSelected.formatted_address && (
            <li className={styles.detail_item}>
              <LocationOnIcon />
              <span>{placeSelected.formatted_address}</span>
            </li>
          )}
          {placeSelected.formatted_phone_number && (
            <li className={styles.detail_item}>
              <LocalPhoneIcon />
              <span>{placeSelected.formatted_phone_number}</span>
            </li>
          )}
          {placeSelected.website && (
            <li className={styles.detail_item}>
              <LanguageIcon />
              <a target="_blank" href={placeSelected.website}>
                {placeSelected.website}
              </a>
            </li>
          )}
        </ul>

        <div className={styles.actions}>
          <a href={placeSelected.url} target="_blank" rel="noreferrer">
            <button className={styles.actions_btn}>
              <FmdGoodIcon />
              <p>Xem thêm tại Maps</p>
            </button>
          </a>

          <button
            className={`${styles.actions_btn} ${isSaved ? styles.saved : ""}`}
            onClick={isSaved ? handleRemovePlace : handleSavePlace}
          >
            <BookmarkIcon />
            <p>{isSaved ? "Đã lưu" : "Bỏ lưu"}</p>
          </button>
        </div>
      </div>

      <hr />

      <div className={styles.reviews}>
        <h2>Đánh giá</h2>
        {placeSelected?.reviews?.map((value, index) => (
          <CommentItem key={index} comment={value} />
        ))}
      </div>
    </div>
  );
}
