import React, { useEffect, useRef } from "react";
import H from '@here/maps-api-for-javascript';

const SchedulePage = () => {
  const HERE_MAP_API_KEY = "Xx4O2iANfrM2MISRYhmxQMzFRsOExmgs7ygOm8N1DPo"; // Thay bằng API Key của mày
  const mapRef = useRef(null);

  useEffect(() => {
    // Load SDK HERE Maps
    const platform = new H.service.Platform({
      apikey: HERE_MAP_API_KEY,
    });

    const defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat: 10.7769, lng: 106.7009 }, // Tọa độ TP.HCM
        zoom: 12,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    return () => {
      map.dispose();
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default SchedulePage;