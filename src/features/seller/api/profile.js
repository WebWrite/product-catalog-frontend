import api from "../../../shared/utils/api";

export const getSellerProfile = async () => {
  const response = await api.get("/seller/profile");
  return response.data.data;
};

export const updateSellerProfile = async (payload) => {
  const { data } = await api.patch("/seller/profile", payload);
  return data;
};

export const changeSellerPassword = async (payload) => {
  const { data } = await api.patch("/seller/profile/password", payload);
  return data;
};
