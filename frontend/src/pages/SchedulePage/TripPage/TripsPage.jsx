import React, { useState, useEffect, useRef } from "react";
import useDidMount from "../../../hooks/useDidMount";
import useDebounce from "../../../hooks/useDebounce";
import ReactDOMServer from "react-dom/server";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import axios from "axios";
import H from "@here/maps-api-for-javascript";
import { useAuth } from "../../../context/AuthProvider";
import SearchBoxHere from "../../../components/SearchBoxHere";
import styles from "./TripPage.module.css";

import { ChromePicker } from "react-color";
import ItineraryItem from "../../../components/ItineraryItem";
import MapMarker from "../../../components/MapMarker";
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
  const url = import.meta.env.VITE_BACKEND_API;
  const { cookies, logout } = useAuth();
  const HERE_MAP_API_KEY = "Xx4O2iANfrM2MISRYhmxQMzFRsOExmgs7ygOm8N1DPo";

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
  const [platform, setPlatform] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [markersArray, setMarkersArray] = useState([]);

  const debounceNote = useDebounce(notes, 500);

  const markerIcon = (index) => {
    const markerHTML = ReactDOMServer.renderToStaticMarkup(
      <MapMarker index={index} color={color} />
    );

    const wrapper = document.createElement("div");
    wrapper.innerHTML = markerHTML;

    const icon = new H.map.DomIcon(wrapper.firstChild);
    return icon;
  };

  const moveToMarker = (lat, lng) => {
    console.log("click");
    if (mapInstanceRef.current) {
      const point = new H.geo.Point(lat, lng);
      mapInstanceRef.current.getViewModel().setLookAtData(
        { position: point, zoom: 12 },
        true // animation enable
      );
    } else {
      console.warn("Map chưa sẵn sàng!");
    }
  };

  const addMarkerAndInfo = ({ position, title }) => {
    const randomKey = nanoid(); //create random id for itinerary
    //Add itinerary to array
    const newIti = {
      id: randomKey,
      name: title,
      notes: "",
      latitude: position.lat,
      longitude: position.lng,
    };
    setItinerary((prev) => [...prev, newIti]);

    const point = new H.geo.Point(position.lat, position.lng);
    const icon = markerIcon(itinerary.length);
    const marker = new H.map.DomMarker(point, { icon: icon });

    marker.setData(title);
    mapInstanceRef.current.addObject(marker);
    mapInstanceRef.current.getViewModel().setLookAtData(
      { position: point, zoom: 12 },
      true // animation enable
    );
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
      markers[index].setIcon(markerIcon(index));
      markers[swapNumber].setIcon(markerIcon(swapNumber));

      return markers;
    });
  };

  const deleteMarker = (index) => {
    setMarkersArray((prev) => {
      const deleteValue = [...prev];
      mapInstanceRef.current.removeObject(deleteValue[index]);
      deleteValue.splice(index, 1);

      for (let i = index; i < deleteValue.length; i++) {
        deleteValue[i].setIcon(markerIcon(i));
      }

      return deleteValue;
    });
  };

  //Get trip data
  useEffect(() => {
    if (!cookies.token) {
      logout();
    }

    const options = {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    };

    axios
      .get(`${url}/get-itinerary/${id}`, options)
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

  //handle Map api
  useEffect(() => {
    if (loading || !latitude || !longitude) return;

    const platformInstance = new window.H.service.Platform({
      apikey: HERE_MAP_API_KEY,
    });
    setPlatform(platformInstance);

    const defaultLayers = platformInstance.createDefaultLayers();

    const map = new window.H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat: latitude, lng: longitude },
        zoom: 10,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );

    mapInstanceRef.current = map;

    window.addEventListener("resize", () => map.getViewPort().resize());
    const behavior = new window.H.mapevents.Behavior(
      new window.H.mapevents.MapEvents(map)
    );
    const ui = window.H.ui.UI.createDefault(map, defaultLayers);

    if (mapRef.current) {
      itinerary.forEach((value, index) => {
        const icon = markerIcon(index);
        const marker = new H.map.DomMarker(
          { lat: parseFloat(value.latitude), lng: parseFloat(value.longitude) },
          { icon }
        );

        console.log(marker instanceof H.map.DomMarker);

        map.addObject(marker);
        setMarkersArray((prev) => [...prev, marker]);
      });
    }

    return () => map.dispose();
  }, [loading, latitude, longitude]);

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
    const options = {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    };
    axios.put(`${url}/update-itinerary-detail`, data, options);
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

    const options = {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    };

    axios.put(`${url}/update-itinerary-info`, data, options);
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
          <SearchBoxHere
            platform={platform}
            onPlaceSelected={addMarkerAndInfo}
            latitude={latitude}
            longitude={longitude}
          />
        </div>
      </div>
      <div className={styles.map}>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
            background: "#eee",
            position: "relative",
          }}
        ></div>
      </div>
    </div>
  );
};

export default TripPage;
