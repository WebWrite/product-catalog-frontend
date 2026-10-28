import api from "../../../shared/utils/api";

const normalize = (c) => ({
  roomId: String(c.roomId ?? c._id),
  otherUser: c.otherParticipant,
  unreadCount: c.unreadCount,
});

export const getConversations = () =>
  api.get("/chat/conversations").then((r) => r.data.data.map(normalize));

export const getUnreadCount = async () =>
  api.get("/chat/unread-count").then((r) => r.data.data.unreadCount);
