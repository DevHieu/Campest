import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import useDebounce from "../../hooks/useDebounce";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";

const SearchMap = ({ onPlaceSelected, lat, lng }) => {
  const wrapperRef = useRef(null);
  const url = import.meta.env.VITE_BACKEND_API;
  const { cookies, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(query, 500);

  const fetchSuggestions = async (query) => {
    const options = {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    };

    axios
      .get(
        `${url}/itinerary/search-places?search=${query}&lat=${lat}&lng=${lng}`,
        options
      )
      .then((res) => {
        console.log(res);
        setSuggestions(res.data.results);
      });
  };

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (placeId, lat, lng) => {
    setQuery("");
    setSuggestions([]);

    if (onPlaceSelected) {
      onPlaceSelected({
        placeId: placeId,
        lat: lat,
        lng: lng,
      });
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <TextField
        fullWidth
        placeholder="Tìm kiếm nơi bạn cần đến"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "white",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray !important",
          },
        }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            marginBottom: "4px",
            backgroundColor: "white",
            listStyle: "none",
            padding: 0,
            border: "1px solid #ccc",
            borderRadius: "6px",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {suggestions.map((item) => {
            console.log(item);
            return (
              <li
                key={item.place_id}
                onClick={() =>
                  handleSelect(
                    item.place_id,
                    item.geometry.location.lat,
                    item.geometry.location.lng
                  )
                }
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
