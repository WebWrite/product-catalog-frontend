import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { emit, socket } from "../../../shared/utils/socket";
import { CHAT_BASE } from "../../../shared/utils/chatPath";
import { hasLoginMarker } from "../../../shared/utils/authStorage";
import { getConversations, getUnreadCount } from "../api/api";

let activeRoomId = null;
export const setActiveRoomId = (id) => {
  activeRoomId = id ? String(id) : null;
};

export const applyMessageToConversations = (qc, msg, myId) => {
  const roomId = String(msg.roomId);

  qc.setQueryData(["conversations"], (old = []) => {
    const idx = old.findIndex((c) => String(c.roomId) === roomId);
    if (idx === -1) return old;

    const conv = old[idx];
    const isMine = String(msg.senderId) === String(myId);
    const isOpen = activeRoomId === roomId;

    const updated = {
      ...conv,
      lastMessage: msg.text || (msg.attachment ? "Attachment" : ""),
      lastMessageAt: msg.createdAt,
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
  const qc = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    const onNotification = (payload) => {
      const msg = payload?.message ?? payload;
      if (msg?.roomId && msg?._id) {
        applyMessageToConversations(qc, msg, userId);
      }

      if (msg?.roomId && msg?._id && String(msg.senderId) !== String(userId)) {
        const isOpen = activeRoomId === String(msg.roomId);
        if (!isOpen) {
          qc.setQueryData(["chat-unread"], (count) => Number(count ?? 0) + 1);
        }
      }
    };

    socket.on("new_message_notification", onNotification);

    return () => {
      socket.off("new_message_notification", onNotification);
      socket.disconnect();
    };
  }, [userId, qc]);
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
