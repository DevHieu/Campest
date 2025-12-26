import axiosClient from "../libs/axiosClient";

export const getAllItineraries = (userId, page, offset) => {
  return axiosClient.get(
    `/itinerary/get-user-itineraries/${userId}?page=${page}&size=${offset}`
  );
};

export const getPlaceDetail = (placeId) => {
  return axiosClient.get(`/itinerary/get-place-details/${placeId}`);
};
