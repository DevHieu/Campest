import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import useDebounce from "../../hooks/useDebounce";

const SearchInput = ({ platform, onPlaceSelected, latitude, longitude }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(query, 500);

  const fetchSuggestions = async (q) => {
    if (!q || !platform) return;

    const service = platform.getSearchService();
    service.autosuggest(
      {
        at: `${latitude},${longitude}`,
        q,
      },
      (result) => {
        setSuggestions(result.items);
      },
      (error) => {
        console.error("HERE autosuggest error:", error);
      }
    );
  };

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    const coords = item.position || (item.access && item.access[0]);
    if (!coords) return;

    setQuery("");
    setSuggestions([]);

    if (onPlaceSelected) {
      onPlaceSelected({
        position: coords,
        title: item.title,
        address: item.address,
      });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
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
            top: "-7rem",
            left: 0,
            right: 0,
            backgroundColor: "white",
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #ccc",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
