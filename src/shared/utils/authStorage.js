const AUTH_STATE_KEY = "isLoggedIn";

export const hasLoginMarker = () =>
  localStorage.getItem(AUTH_STATE_KEY) === "true";

export const setLoginMarker = () => {
  localStorage.setItem(AUTH_STATE_KEY, "true");
};

export const clearLoginMarker = () => {
  localStorage.removeItem(AUTH_STATE_KEY);
};
