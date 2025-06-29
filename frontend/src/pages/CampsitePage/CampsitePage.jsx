import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import waiting_img from "../../assets/images/campsite_waiting.png";
import styles from "./CampsitePage.module.css";
import { Button, TextField, Snackbar, Alert } from "@mui/material";

import Rating from "@mui/material/Rating";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LanguageIcon from "@mui/icons-material/Language";

import CommentItem from "../../components/CommentItem";
import CampsiteResult from "../../components/CampsiteResult";

export default function CampsitePage() {
  const url = import.meta.env.VITE_BACKEND_API;
  const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [placeSelected, setPlaceSelected] = useState(null);
  const [alert, setAlert] = useState(false);
  const { cookies, logout } = useAuth();

  useEffect(() => {
    if (!cookies.token) {
      logout();
    }
    console.log("Cookies:", cookies.token);
  }, []);

  const handleSearch = () => {
    if (!searchText) {
      setResults([]);
      return;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    };

    axios.get(`${url}/find-campsite/${searchText}`, options).then((res) => {
      console.log(res);
      setResults(res.data.results);
    });
  };

  const handleSelect = (id) => {
    const options = {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    };

    axios.get(`${url}/get-place-details/${id}`, options).then((res) => {
      setPlaceSelected(res.data.result);
      console.log(res.data.result);
    });
  };

  const handleSavePlace = () => {
    setAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
  };

  return (
    <div className={styles.wrapper}>
      <Snackbar
        open={alert}
        autoHideDuration={3000} // 3 giây
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // vị trí
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          Chức năng sẽ thêm trong tương lai
        </Alert>
      </Snackbar>

      <div className={styles.left}>
        <div className={styles.search_wrapper}>
          <TextField
            id="outlined-basic"
            label="Nơi bạn muốn đến"
            variant="outlined"
            className={styles.search_box}
            onChange={(e) => {
              setSearchText(e.target.value); // Update searchText state
            }}
            value={searchText}
          />
          <Button variant="contained" onClick={handleSearch}>
            Find campsites
          </Button>
        </div>
        <div className={styles.results}>
          {results.length > 0 &&
            results.map((value) => (
              <CampsiteResult
                key={value.place_id}
                placeId={value.place_id}
                title={value.name}
                img={value.photos[0].photo_reference}
                rating={value.rating}
                address={value.formatted_address}
                handleSelect={handleSelect}
              />
            ))}
        </div>
      </div>
      <div className={styles.right}>
        {!placeSelected ? (
          <div className={styles.waiting}>
            <img src={waiting_img} alt="waiting" />
            <h2>Hãy chọn một bãi cắm trại</h2>
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.header}>
              <img
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeSelected.photos[0].photo_reference}&key=${apiKey}`}
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
                <p>{placeSelected.types.join(", ")}</p>
              </div>
            </div>
            <hr />
            <div className={styles.detail}>
              <h2>Chi tiết</h2>
              <ul className={styles.detail_list}>
                {placeSelected.formatted_address && (
                  <li className={styles.detail_item}>
                    <LocationOnIcon
                      fontSize="30px"
                      className={styles.detail_icon}
                    />
                    <span>{placeSelected.formatted_address}</span>
                  </li>
                )}
                {placeSelected.formatted_phone_number && (
                  <li className={styles.detail_item}>
                    <LocalPhoneIcon
                      fontSize="30px"
                      className={styles.detail_icon}
                    />
                    <span>{placeSelected.formatted_phone_number}</span>
                  </li>
                )}
                {placeSelected.website && (
                  <li className={styles.detail_item}>
                    <LanguageIcon
                      fontSize="30px"
                      className={styles.detail_icon}
                    />
                    <span>{placeSelected.website}</span>
                  </li>
                )}
              </ul>
              <div className={styles.actions}>
                <a href={placeSelected.url} target="_blank">
                  <button className={styles.actions_btn}>
                    <FmdGoodIcon />
                    <p>Xem thêm tại Maps</p>
                  </button>
                </a>
                <button
                  className={styles.actions_btn}
                  onClick={handleSavePlace}
                >
                  <BookmarkIcon />
                  <p>Lưu lại</p>
                </button>
              </div>
            </div>
            <hr />
            <div className={styles.reviews}>
              <h2>Đánh giá</h2>
              {placeSelected.reviews.length > 0 &&
                placeSelected.reviews.map((value, index) => (
                  <div key={index} className={styles.review_item}>
                    <CommentItem comment={value} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
