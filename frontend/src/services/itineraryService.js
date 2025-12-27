import axiosClient from "../libs/axiosClient";

export const getAllItineraries = async (userId, page, offset) => {
  const res = await axiosClient.get(
    `/itinerary/get-user-itineraries/${userId}?page=${page}&size=${offset}`
  );
  return res.data;
};

export const getPlaceDetail = async (placeId) => {
  const res = await axiosClient.get(`/itinerary/get-place-details/${placeId}`);
  return res.data;
};

export const getItinerary = async (id) => {
  const res = await axiosClient.get(`/itinerary/get-itinerary/${id}`);
  return res.data;
};

export const updateItineraryDetail = async (data) => {
  const res = await axiosClient.put("/itinerary/update-itinerary-detail", data);
  return res.data;
};

export const updateItineraryInfo = async (data) => {
  const res = await axiosClient.put("/itinerary/update-itinerary-info", data);
  return res.data;
};

export const deleteItinerary = async (id) => {
  const res = await axiosClient.delete(`/itinerary/delete-itinerary/${id}`);
  return res.data;
};
