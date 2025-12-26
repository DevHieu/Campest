import React, { useState, useEffect, useRef, useCallback } from "react";
import useDidMount from "../../../hooks/useDidMount";
import useDebounce from "../../../hooks/useDebounce";
import ReactDOMServer from "react-dom/server";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import axios from "axios";
import H from "@here/maps-api-for-javascript";
import { useAuth } from "../../../context/AuthProvider";
import SearchMap from "../../../components/Maps/SearchMap";
import styles from "./TripPage.module.css";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

import { ChromePicker } from "react-color";
import ItineraryItem from "../../../components/Itinerary/ItineraryItem";
import MapMarker from "../../../components/Maps/MapMarker";
import PlaceDetails from "../../../components/Itinerary/PlaceDetails";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const TripPage = () => {
  const { cookies, logout } = useAuth();
  const url = import.meta.env.VITE_BACKEND_API;
  const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;

  const { id } = useParams();
  const [loading, isLoading] = useState(true);
  const [color, setColor] = useState("");
  const [tripName, setTripName] = useState("Trip to");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [itinerary, setItinerary] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [markersArray, setMarkersArray] = useState([]);
  const [placeDetail, setPlaceDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [cameraProps, setCameraProps] = useState(null);
  const handleCameraChange = useCallback((ev) => {
    setCameraProps(ev.detail);
  });

  const debounceNote = useDebounce(notes, 500);

  const options = {
    headers: {
      Authorization: `Bearer ${cookies.token}`,
    },
  };

  const markerIcon = (index) => {
    const markerHTML = ReactDOMServer.renderToStaticMarkup(
      <MapMarker index={index} color={color} />
    );

    const wrapper = document.createElement("div");
    wrapper.innerHTML = markerHTML;

    const icon = new H.map.DomIcon(wrapper.firstChild);
    return icon;
  };

  const moveToMarker = (lat, lng, index) => {
    setCameraProps({
      center: { lat: lat, lng: lng },
      zoom: 12,
    });

    if (index !== -1) {
      console.log(index);
      console.log(itinerary[index].place_id);
      handlePlaceSelected({
        placeId: itinerary[index].place_id,
        lat: null,
        lng: null,
      });
    }
  };

  const addMarkerAndInfo = async ({ place }) => {
    let data = place;

    if (typeof place === "string") {
      data = await handlePlaceSelected(place);
    }

    console.log(data);

    const randomKey = nanoid(); //create random id for itinerary
    // Add itinerary to array
    const newIti = {
      id: randomKey,
      place_id: data.place_id,
      name: data.name,
      notes: "",
      latitude: data.geometry.location.lat,
      longitude: data.geometry.location.lng,
    };
    setItinerary((prev) => [...prev, newIti]);

    const marker = markerIcon(itinerary.length);
    setMarkersArray((prev) => [...prev, marker]);
  };

  const swapMarker = (index, isMoveUp) => {
    setMarkersArray((prev) => {
      const markers = [...prev];

      const swapNumber = isMoveUp ? index - 1 : index + 1;

      [markers[index], markers[swapNumber]] = [
        markers[swapNumber],
        markers[index],
      ];

      return markers;
    });
  };

  const deleteMarker = (index) => {
    console.log("deleteign");
    setMarkersArray((prev) => {
      console.log(prev);
      return prev.filter((_, i) => {
        console.log(i, index);
        return i !== index;
      });
    });
  };

  const handlePlaceSelected = async ({ placeId, lat, lng }) => {
    console.log(placeId);
    setPlaceDetail(placeId);
    setShowDetail(true);

    if (lat && lng) {
      moveToMarker(lat, lng, -1);
    }
  };

  const handleMapClick = (e) => {
    if (e.detail.placeId) {
      e.stop(); // ngăn map xử lý click mặc định
      handlePlaceSelected(e.detail.placeId);
    }
  };

  //Get trip data
  useEffect(() => {
    if (!cookies.token) {
      logout();
    }

    axios
      .get(`${url}/itinerary/get-itinerary/${id}`, options)
      .then((res) => {
        setTripName(res.data.name);
        setStartDate(res.data.startDate);
        setEndDate(res.data.endDate);
        setNotes(res.data.note);
        setLatitude(parseFloat(res.data.latitude));
        setLongitude(parseFloat(res.data.longitude));
        setItinerary(res.data.detail);
        setColor(res.data.color);
      })
      .then(() => isLoading(false));
  }, []);

  //update marker's color when color change
  useEffect(() => {
    markersArray.forEach((value, index) => {
      const marker = markerIcon(index);
      value.setIcon(marker);
    });
  }, [color]);

  //update itinerary details
  useDidMount(() => {
    const data = {
      id: id,
      detail: itinerary,
    };
    console.log("updateting detail");

    axios.put(`${url}/itinerary/update-itinerary-detail`, data, options);
  }, [itinerary]);

  //update itinerary info
  useDidMount(() => {
    console.log("updateting info");
    const data = {
      id: id,
      name: tripName,
      startDate: startDate,
      endDate: endDate,
      note: debounceNote,
      color: color,
    };

    axios.put(`${url}/itinerary/update-itinerary-info`, data, options);
  }, [tripName, startDate, endDate, debounceNote, color]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.trip}>
        <div className={styles.infomation} style={{ backgroundColor: color }}>
          {showPicker && (
            <ChromePicker
              color={color}
              onChangeComplete={(newColor) => {
                setColor(newColor.hex);
              }}
              disableAlpha
              className={styles.picker}
            />
          )}
          <IconButton
            className={styles.color_picker}
            onClick={() => setShowPicker(!showPicker)}
          >
            <EditIcon className={styles.picker_icon} />
          </IconButton>
          <TextField
            id="outlined-basic"
            label=""
            placeholder="Nhập tên chuyến đi của bạn"
            variant="outlined"
            defaultValue={tripName}
            sx={{
              "&": {
                width: "60%",
                margin: "2rem 4rem",
              },
              "& .MuiInputBase-root": {
                backgroundColor: "white",
                borderRadius: "8px",
                fontWeight: "900",
                fontSize: "30px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
              },
            }}
          />
          <div className={styles.choose_date}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày bắt đầu"
                format="DD/MM/YYYY"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  fontWeight: "900",
                  "& .MuiInputLabel-root": {
                    color: "#20321e",
                    background: "white",
                    padding: "2px 5px",
                    borderRadius: "10px",
                  },
                }}
                value={dayjs(startDate)}
                onChange={(value) => {
                  setStartDate(value.format("MM/DD/YYYY"));
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày kết thúc"
                format="DD/MM/YYYY"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  fontWeight: "900",
                  "& .MuiInputLabel-root": {
                    color: "#20321e",
                    background: "white",
                    padding: "2px 5px",
                    borderRadius: "10px",
                  },
                }}
                value={dayjs(endDate)}
                onChange={(value) => {
                  setEndDate(value.format("MM/DD/YYYY"));
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className={styles.notes}>
          <h2>Ghi chú</h2>
          <TextField
            placeholder="Viết những thứ bạn cần ghi nhớ hoặc chú ý ở đây"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            multiline
            variant="outlined"
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "10px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
              },
            }}
          />
        </div>
        <hr />
        <div className={styles.itinerary}>
          <h2>Hành trình</h2>
          <div className={styles.iti_list}>
            {itinerary.map((value, index) => {
              return (
                <ItineraryItem
                  key={value.id}
                  index={index}
                  name={value.name}
                  notes={value.notes}
                  lat={value.latitude}
                  lng={value.longitude}
                  color={color}
                  setItinerary={setItinerary}
                  swapMarker={swapMarker}
                  deleteMarker={deleteMarker}
                  isLast={index === itinerary.length - 1}
                  findMarker={moveToMarker}
                />
              );
            })}
          </div>
          <div id="search-container" className={styles.search_box} />
          <SearchMap
            onPlaceSelected={handlePlaceSelected}
            lat={latitude}
            lng={longitude}
          />
        </div>
      </div>
      <div className={styles.map}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#eee",
            position: "relative",
          }}
        >
          <APIProvider
            apiKey={GOOGLE_MAP_API_KEY}
            onLoad={() => console.log("Maps API has loaded.")}
          >
            <Map
              {...cameraProps}
              mapId={GOOGLE_MAP_ID}
              defaultCenter={{ lat: latitude, lng: longitude }}
              defaultZoom={10}
              onCameraChanged={handleCameraChange}
              onClick={handleMapClick}
              gestureHandling="greedy"
              options={{
                clickableIcons: true,
              }}
            >
              {itinerary.map((value, index) => (
                <AdvancedMarker
                  key={value.id}
                  position={{
                    lat: parseFloat(value.latitude),
                    lng: parseFloat(value.longitude),
                  }}
                >
                  <MapMarker index={index} color={color} />
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>

        {showDetail && (
          <div className={styles.details}>
            <button
              onClick={() => {
                setShowDetail(false);
              }}
            >
              x
            </button>
            <PlaceDetails
              placeId={placeDetail}
              addToItinerary={addMarkerAndInfo}
              deleteMarker={deleteMarker}
              setItinerary={setItinerary}
              addedIndex={itinerary.findIndex(
                (item) => item.place_id === placeDetail
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPage;
