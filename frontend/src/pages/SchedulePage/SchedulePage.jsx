import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequireAuth from "../../hooks/useRequireAuth";
import { nanoid, customAlphabet } from "nanoid";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchSchedule } from "../../store/scheduleSlice";

import styles from "./Schedule.module.css";
import ScheduleItem from "../../components/ScheduleItem";
import Loading from "../../components/Loading";
import RequireAuthDialog from "../../components/RequireAuthDialog";
import {
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useDidMount from "../../hooks/useDidMount";
import { createItinerary } from "../../services/itineraryService";

export default function SchedulePage() {
  const COUNTRY_API_KEY = import.meta.env.VITE_COUNTRY_CITIES_API_KEY;
  const dispatch = useDispatch();
  const { open, close, requireAuth } = useRequireAuth();
  const [loading, isLoading] = useState(true);
  const [itineraries, setItineraries] = useState([]);
  const [countryData, setCountryData] = useState({});
  const [country, setCountry] = useState({});
  const [stateData, setStateData] = useState({});
  const [state, setState] = useState({});
  const [startDate, setStartDate] = useState(dayjs().format("MM/DD/YYYY"));
  const [endDate, setEndDate] = useState(
    dayjs().add(1, "day").format("MM/DD/YYYY")
  );
  const [openLogin, setOpenLogin] = useState(false);
  const { user, cookies, logout } = useAuth();
  const navigateTo = useNavigate();
  dayjs.extend(customParseFormat);

  //Make nanoid not generate "-" or "_"
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 21);

  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", COUNTRY_API_KEY);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  useEffect(() => {
    const fetchCountries = async () => {
      fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setCountryData(result);
          setCountry(result[239]); //set default country is Vietnam
        })
        .catch((error) => console.log("error", error));
    };

    fetchCountries();
  }, []);

  useDidMount(() => {
    fetch(
      `https://api.countrystatecity.in/v1/countries/${country.iso2}/states`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setStateData(result))
      .then(() => isLoading(false))
      .catch((error) => console.log("error", error));
  }, [country]);

  useEffect(() => {
    const fetchItineraries = async () => {
      if (user) {
        const res = await dispatch(
          fetchSchedule({
            userId: user.id,
            page: 0,
            size: 10,
          })
        );
        setItineraries(res.payload.content);
      }
    };

    fetchItineraries();
  }, [user]);

  const getCoordinate = async () => {
    console.log(state);
    try {
      // Has the user selected the state yet?
      // If selected ? get state coordinates : get country coordinates
      let url = state
        ? `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/${state.iso2}`
        : `https://api.countrystatecity.in/v1/countries/${country.iso2}`;

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      const lat = result.latitude;
      const lng = result.longitude;

      return { lat, lng };
    } catch (error) {
      console.log("error", error);
      return {};
    }
  };

  const createNewItinerary = async () => {
    try {
      const randomId = nanoid();
      const coor = await getCoordinate();
      const name = state?.name || country?.name || "Unknown";

      const data = {
        id: randomId,
        userId: user.email,
        name: "Trip to " + name,
        startDate: startDate,
        endDate: endDate,
        latitude: coor.lat,
        longitude: coor.lng,
        note: "",
        detail: [],
        color: "#20321e",
      };

      await createItinerary(data);
      navigateTo("/schedule/trip/" + randomId);
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading_wrapper">
        <Loading />
      </div>
    );
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
              label="Chọn quốc gia"
              autoComplete="new-password"
            />
          )}
        ></Autocomplete>

        <Autocomplete
          className={styles.choose_location}
          options={stateData}
          value={state || null}
          onChange={(event, newValue) => {
            setState(newValue);
          }}
          getOptionLabel={(option) => option?.name || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Chọn tỉnh"
              autoComplete="new-password"
            />
          )}
        ></Autocomplete>
        <div className={styles.choose_date}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày bắt đầu"
              format="DD/MM/YYYY"
              value={dayjs(startDate, "MM/DD/YYYY")}
              onChange={(value) => {
                setStartDate(value.format("MM/DD/YYYY"));
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày kết thúc"
              format="DD/MM/YYYY"
              value={dayjs(endDate, "MM/DD/YYYY")}
              onChange={(value) => {
                setEndDate(value.format("MM/DD/YYYY"));
              }}
            />
          </LocalizationProvider>
        </div>
        <Button
          onClick={() => requireAuth(createNewItinerary)}
          className="shadow_btn"
        >
          Tạo chuyến đi ngay
        </Button>
      </div>
      <hr />
      <div className={styles.trips_list}>
        <h2>Những chuyến đi đã lên kế hoạch</h2>
        <div className={styles.itinerary_list}>
          {itineraries?.map((value, index) => (
            <ScheduleItem
              key={value.id}
              id={value.id}
              index={index}
              name={value.name}
              startDate={value.startDate}
              endDate={value.endDate}
              setItineraries={setItineraries}
            />
          ))}
        </div>
      </div>

      <RequireAuthDialog open={open} onClose={close} />
    </div>
  );
}
