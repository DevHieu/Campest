import React, { use, useEffect, useState } from "react";
import waiting_img from "../../assets/images/campsite_waiting.png";
import styles from "./CampsitePage.module.css";
import { Button, TextField } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CampsiteResult from "../../components/Campsite/CampsiteResult";
import CampsiteDetail from "../../components/Campsite/CampsiteDetail";
import Loading from "../../components/Loading";

import {
  searchCampsite,
  getCampsiteDetail,
  getSavedCampsites,
} from "../../services/campsiteService";
import { useAuth } from "../../context/AuthProvider";

export default function CampsitePage() {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [placeSelected, setPlaceSelected] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [menu, setMenu] = useState("search");
  const [saved, setSaved] = useState([]);

  const isSaved = saved.some(
    (item) => item.placeId === placeSelected?.place_id
  );

  const handleSearch = async () => {
    if (!searchText) {
      setResults([]);
      return;
    }

    try {
      setListLoading(true);
      setPlaceSelected(null);

      const res = await searchCampsite(searchText);
      setResults(res.data.results || []);
    } catch {
      setResults([]);
    } finally {
      setListLoading(false);
    }
  };

  const handleSelect = async (id) => {
    try {
      setDetailLoading(true);
      const res = await getCampsiteDetail(id);
      setPlaceSelected(res.data.result);
      const index = saved.findIndex(
        (item) => item.placeId === res.data.result.place_id
      );
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchSaved = async () => {
      const list = await getSavedCampsites(user.id);
      setSaved(list.data.data || []);
    };

    fetchSaved();
  }, [user]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <div
          className={`${styles.menu_item} ${
            menu === "search" ? styles.active : ""
          }`}
          onClick={() => setMenu("search")}
        >
          <SearchIcon /> Tìm kiếm
        </div>

        <div
          className={`${styles.menu_item} ${
            menu === "saved" ? styles.active : ""
          }`}
          onClick={() => setMenu("saved")}
        >
          <BookmarkIcon /> Đã lưu
        </div>
      </div>

      <div className={styles.main}>
        {menu === "search" && (
          <div className={styles.left}>
            <div className={styles.search_wrapper}>
              <TextField
                label="Nơi bạn muốn đến"
                variant="outlined"
                className={styles.search_box}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button variant="contained" onClick={handleSearch}>
                Find campsites
              </Button>
            </div>

            <div className={styles.results}>
              {listLoading && (
                <div style={{ marginTop: "20px" }}>
                  <Loading />
                </div>
              )}
              {!listLoading &&
                results.map((value) => (
                  <CampsiteResult
                    key={value.place_id}
                    placeId={value.place_id}
                    title={value.name}
                    img={value?.photos?.[0]?.photo_reference || ""}
                    rating={value.rating}
                    address={value.formatted_address}
                    handleSelect={handleSelect}
                  />
                ))}
            </div>
          </div>
        )}

        {menu === "saved" && (
          <div className={styles.results}>
            <h2 className={styles.title}>Đã lưu</h2>

            {saved.length === 0 ? (
              <p className={styles.title}>Chưa có dữ liệu</p>
            ) : (
              saved.map((value) => (
                <CampsiteResult
                  key={value.placeId}
                  placeId={value.placeId}
                  title={value.name}
                  img={value?.image || ""}
                  rating={value.rating}
                  address={value.address}
                  handleSelect={handleSelect}
                />
              ))
            )}
          </div>
        )}
      </div>

      <div className={styles.right}>
        {detailLoading ? (
          <Loading />
        ) : !placeSelected ? (
          <div className={styles.waiting}>
            <img src={waiting_img} alt="waiting" />
            <h2>Hãy tìm và chọn một bãi cắm trại</h2>
          </div>
        ) : (
          <CampsiteDetail
            placeSelected={placeSelected}
            loading={detailLoading}
            apiKey={apiKey}
            isSaved={isSaved}
            setSavedList={setSaved}
          />
        )}
      </div>
    </div>
  );
}
