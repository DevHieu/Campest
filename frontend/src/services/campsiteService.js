import axiosClient from "../libs/axiosClient";

export const searchCampsite = (keyword) => {
  return axiosClient.get(`/public/place/search?query=${keyword}`);
};

export const getCampsiteDetail = (placeId) => {
  return axiosClient.get(`/public/place/${placeId}`);
};

export const getSavedCampsites = () => {
  return axiosClient.get("/user/campsites/saved");
};

export const saveCampsite = (campsiteData) => {
  return axiosClient.post("/user/campsites/", campsiteData);
};

export const removeCampsite = (placeId) => {
  return axiosClient.delete(`/user/campsites/${placeId}`);
};

export const addCampsiteToItinerary = (itineraryId, place) => {
  return axiosClient.post(`/user/campsites/${itineraryId}/details`, place);
};
