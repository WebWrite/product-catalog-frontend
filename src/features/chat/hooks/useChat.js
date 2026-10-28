import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { emit, socket } from "../../../shared/utils/socket";
import { CHAT_BASE } from "../../../shared/utils/chatPath";
import { getConversations, getUnreadCount } from "../api/api";

export const useChatSocket = () => {
  const user = useSelector((state) => state.user);
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;

    socket.connect();

    const refresh = () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      qc.invalidateQueries({ queryKey: ["chat-unread"] });
    };

    socket.on("new_message_notification", refresh);
    return () => {
      socket.off("new_message_notification", refresh);
      socket.disconnect();
    };
  }, [user?.id, qc]);
};

export const useConversations = () =>
  useQuery({ queryKey: ["conversations"], queryFn: getConversations });

export const useUnreadCount = () =>
  useQuery({ queryKey: ["chat-unread"], queryFn: getUnreadCount });

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
