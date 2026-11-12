import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, notification } from "antd";
import { emit, socket } from "../../../shared/utils/socket";
import { CHAT_BASE } from "../../../shared/utils/chatPath";
import {
  clearLoginMarker,
  hasLoginMarker,
} from "../../../shared/utils/authStorage";
import { getConversations, getUnreadCount } from "../api/api";
import { refreshToken } from "../../../shared/utils/api";
import { router } from "../../../app/router/route";
import { removeUser } from "../../../app/store/user/userSlice";

let activeRoomId = null;
export const setActiveRoomId = (id) => {
  activeRoomId = id ? String(id) : null;
};

export const applyMessageToConversations = (qc, payload, myId) => {
  const roomId = String(payload.roomId);

  const cached = qc.getQueryData(["conversations"]);
  const exists =
    Array.isArray(cached) && cached.some((c) => String(c.roomId) === roomId);
  if (!exists) {
    qc.invalidateQueries({ queryKey: ["conversations"] });
    return;
  }

  qc.setQueryData(["conversations"], (old = []) => {
    const idx = old.findIndex((c) => String(c.roomId) === roomId);
    if (idx === -1) return old;

    const conv = old[idx];
    const isMine = String(payload.senderId) === String(myId);
    const isOpen = activeRoomId === roomId;

    const updated = {
      ...conv,
      lastMessage: payload.text || (payload.attachment ? "Attachment" : ""),
      lastMessageAt: payload.createdAt,
      unreadCount: isMine || isOpen ? 0 : (conv.unreadCount || 0) + 1,
    };
    return [updated, ...old.slice(0, idx), ...old.slice(idx + 1)];
  });
};

export const markConversationRead = (qc, roomId) => {
  qc.setQueryData(["conversations"], (old = []) =>
    old.map((c) =>
      String(c.roomId) === String(roomId) ? { ...c, unreadCount: 0 } : c,
    ),
  );
};

export const useChatSocket = () => {
  const user = useSelector((state) => state.user);
  const userId = user?.id;
  const dispatch = useDispatch();
  const qc = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    const onNotification = (payload) => {
      const msgId = payload?.messageId;
      if (payload?.roomId && msgId) {
        applyMessageToConversations(qc, payload, userId);
      }

      if (
        payload?.roomId &&
        msgId &&
        String(payload.senderId) !== String(userId)
      ) {
        const isOpen = activeRoomId === String(payload.roomId);
        if (!isOpen) {
          qc.setQueryData(["chat-unread"], (count) => Number(count ?? 0) + 1);
        }
      }
    };
    let cancelled = false;
    let refreshing = false;
    const onDisconnect = async (reason) => {
      console.log("refresh");
      if (reason === "io client disconnect") return;
      if (refreshing || cancelled) return;

      refreshing = true;
      const result = await refreshToken();
      refreshing = false;

      if (cancelled) return;
      console.log("this is result of refresh token", result);
      if (result.success) {
        socket.connect();
        qc.invalidateQueries({ queryKey: ["conversations"] });
        qc.invalidateQueries({ queryKey: ["chat-unread"] });
      } else {
        if (result.status === 403) {
          notification.error({
            message: "Account Deactivated",
            description: result.message,
            placement: "bottomRight",
            duration: 4,
            key: "account-inactive",
          });
        }
        dispatch(removeUser());
        qc.removeQueries({ queryKey: ["currentUser"] });
        clearLoginMarker();
        router.navigate("/auth/login", { replace: true });
      }
    };
    socket.on("new_message_notification", onNotification);
    socket.on("disconnect", onDisconnect);

    return () => {
      cancelled = true;
      socket.off("new_message_notification", onNotification);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [dispatch, userId, qc]);
};

export const useConversations = () => {
  const user = useSelector((state) => state.user);

  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: hasLoginMarker() && !!user?.email,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUnreadCount = () => {
  const user = useSelector((state) => state.user);

  return useQuery({
    queryKey: ["chat-unread"],
    queryFn: getUnreadCount,
    enabled: hasLoginMarker() && !!user?.email,
    refetchOnWindowFocus: false,
  });
};

export const useStartChat = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const user = useSelector((state) => state.user);
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ admin = false, ...payload }) =>
      emit(admin ? "create_admin_chat" : "create_chat", payload),
    onSuccess: ({ roomId }) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      navigate(`${CHAT_BASE[user.role]}/${roomId}`);
    },
    onError: (err) =>
      notification.error({
        title: "Unable to start chat",
        description: err.message,
        placement: "bottomRight",
      }),
  });
};
