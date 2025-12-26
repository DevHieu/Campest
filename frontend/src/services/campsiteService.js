import axiosClient from "../libs/axiosClient";

export const searchCampsite = (keyword) => {
  return axiosClient.get(`/campsite/find-campsite/${keyword}`);
};

export const getCampsiteDetail = (placeId) => {
  return axiosClient.get(`/campsite/get-place-details/${placeId}`);
};

export const getSavedCampsites = (userId) => {
  return axiosClient.get(`/campsite/saved-campsites/${userId}`);
};

export const saveCampsite = (campsiteData) => {
  return axiosClient.post(`/campsite/save-campsite`, campsiteData);
};

export const removeCampsite = (userId, placeId) => {
  return axiosClient.delete(
    `/campsite/remove-campsite?userId=${userId}&placeId=${placeId}`
  );
};

export const addCampsiteToItinerary = (itineraryId, place) => {
  return axiosClient.post(
    `/campsite/add-campsite-to-itinerary/${itineraryId}`,
    place
  );
};
