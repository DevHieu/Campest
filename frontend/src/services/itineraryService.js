import axiosClient from "../libs/axiosClient";

export const getAllItineraries = async (page, offset) => {
  const res = await axiosClient.get(
    `/user/itinerary?page=${page}&size=${offset}`
  );
  return res.data;
};

export const getPlaceDetail = async (placeId) => {
  const res = await axiosClient.get(`/public/place/${placeId}`);
  return res.data;
};

export const getItinerary = async (id) => {
  const res = await axiosClient.get(`/user/itinerary/${id}`);
  return res.data;
};

export const createItinerary = async (data) => {
  const res = await axiosClient.post("/user/itinerary/", data);
  return res.data;
};

export const updateItineraryDetail = async (id, data) => {
  const res = await axiosClient.put(`/user/itinerary/details/${id}`, data);
  return res.data;
};

export const updateItineraryInfo = async (id, data) => {
  const res = await axiosClient.put(`/user/itinerary/info/${id}`, data);
  return res.data;
};

export const deleteItinerary = async (id) => {
  const res = await axiosClient.delete(`/user/itinerary/${id}`);
  return res.data;
};
