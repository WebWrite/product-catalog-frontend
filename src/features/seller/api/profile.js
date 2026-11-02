import api from "../../../shared/utils/api";

export const getSellerProfile = async () => {
  const { data } = await api.get("/seller/profile");
  return data.data;
};
