import { logout } from "./api";
import { clearLoginMarker } from "./authStorage";
import { disconnectSocket } from "./socket";

export async function logoutClient({ dispatch, queryClient, removeUser }) {
  const res = await logout();
  if (res.status === 200) {
    disconnectSocket();
    clearLoginMarker();
    dispatch(removeUser());
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    queryClient.clear();
  }
  return res;
}
