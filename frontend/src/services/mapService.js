import axiosClient from "../libs/axiosClient";

export const searchPlace = async (query, lat, lng) => {
  const res = await axiosClient.get(
    `/itinerary/search-places?search=${query}&lat=${lat}&lng=${lng}`
  );
  return res.data;
};
