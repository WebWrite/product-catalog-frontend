import { io } from "socket.io-client";

const backendUrl = new URL(import.meta.env.VITE_BACKEND_URL);
const socketUrl = backendUrl.origin;

export const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false,
});

export const emit = (event, payload) =>
  new Promise((res, rej) => {
    const onConnectError = (error) => {
      socket.off("connect_error", onConnectError);
      rej(error);
    };

    if (!socket.connected) {
      socket.once("connect_error", onConnectError);
      socket.connect();
    }

    socket.emit(event, payload, (response) => {
      socket.off("connect_error", onConnectError);
      response?.success
        ? res(response)
        : rej(new Error(response?.message || "Something went wrong"));
    });
  });
