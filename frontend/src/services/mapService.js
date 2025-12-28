import axiosClient from "../libs/axiosClient";

export const searchPlaceNearby = async (query, lat, lng) => {
  const res = await axiosClient.get(
    `/public/place/nearby?search=${query}&lat=${lat}&lng=${lng}`
  );
  return res.data;
};
