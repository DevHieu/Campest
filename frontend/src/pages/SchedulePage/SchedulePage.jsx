import { TextField, Button, Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import axios from "axios";

export default function SchedulePage() {
  const [loading, isLoading] = useState(true);
  const [countryData, setCountryData] = useState({});
  const [country, setCountry] = useState({});
  const [cityData, setCityData] = useState({});
  const [city, setCity] = useState({});

  const options = {
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_COUNTRY_CITIES_API_KEY,
      "x-rapidapi-host": "country-state-city-search-rest-api.p.rapidapi.com",
    },
  };

  useEffect(() => {
    axios
      .get(
        "https://country-state-city-search-rest-api.p.rapidapi.com/allcountries",
        options
      )
      .then((response) => {
        setCountryData(response.data);
        setCountry(response.data[239]);
      })
      .then(() => {
        isLoading(false);
      });
  }, []);

  useEffect(() => {
    if (country != undefined) {
      const options = {
        method: "GET",
        url: "https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode",
        params: { countrycode: country.isoCode },
        headers: {
          "x-rapidapi-key":
            "a24b9a11b7mshca847092fb4f091p1ae883jsn1b456c458879",
          "x-rapidapi-host":
            "country-state-city-search-rest-api.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then((response) => {
          setCityData(response.data);
          console.log(response.data);
        })
        .then(() => {
          isLoading(false);
        });
    }
  }, [country]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.search}>
        <h2>Lên kế hoạch cho chuyến camping sắp tới</h2>
        <Autocomplete
          className={styles.choose_location}
          options={countryData}
          defaultValue={countryData[239]} // Set default value is Vietnam
          value={country || null}
          onChange={(event, newValue) => setCountry(newValue)}
          getOptionLabel={(option) => option?.name || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a country"
              autoComplete="new-password"
            />
          )}
        ></Autocomplete>

        <Autocomplete
          className={styles.choose_location}
          options={cityData}
          value={city || null}
          onChange={(event, newValue) => setCity(newValue)}
          getOptionLabel={(option) => option?.name || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a city"
              autoComplete="new-password"
            />
          )}
        ></Autocomplete>

        <Button
          onClick={() => {
            console.log(country);
          }}
        >
          Tạo chuyến đi ngay
        </Button>
      </div>
      <hr />
      <div className={styles.trips_list}>
        <h2>Những chuyến đi đã lên kế hoạch</h2>
      </div>
    </div>
  );
}
