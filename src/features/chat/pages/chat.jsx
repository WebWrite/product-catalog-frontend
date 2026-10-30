import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { App, Button, Input, Skeleton } from "antd";
import { MdArrowBack, MdOutlineChat, MdSearch } from "react-icons/md";
import CustomTag from "../../../shared/components/customTag";
import InboxItem from "../components/inboxItem";
import ChatMessage from "../components/chatMessage";
import ChatInput from "../components/chatInput";
import { initials } from "../../../shared/utils/initialsName";
import { formatDate } from "../../../shared/utils/formatDate";
import { emit, socket } from "../../../shared/utils/socket";
import { useConversations } from "../hooks/useChat";
import { IoCloseCircle } from "react-icons/io5";
import { uplaodAttachment } from "../api/api";

function Chat() {
  const TABS = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "admin", label: "Admin" },
  ];

  const TAB_TEST = {
    all: () => true,
    unread: (c) => c.unreadCount > 0,
    admin: (c) => c.otherUser?.role === "admin",
  };
  const { id } = useParams();
  const { pathname } = useLocation();
  const base = pathname.split("/chat")[0] + "/chat";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { notification } = App.useApp();
  const user = useSelector((state) => state.user);
  const messageScrollRef = useRef(null);
  const typingTimer = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const { data: inbox = [], isLoading: inboxLoading } = useConversations();
  const active = inbox.find((c) => String(c.roomId) === id);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const q = search.trim().toLowerCase();
  const visibleInbox = inbox.filter(
    (c) =>
      TAB_TEST[tab](c) && (!q || c.otherUser?.name?.toLowerCase().includes(q)),
  );
  const notifyError = (title, err) =>
    notification.error({
      title,
      description: err.message,
      placement: "bottomRight",
    });

  useEffect(() => {
    if (!id) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoadingRoom(true);
    setMessages([]);

    const join = () =>
      emit("join_room", { roomId: id })
        .then((res) => {
          if (cancelled) return;
          setMessages(res.messages);
          qc.invalidateQueries({ queryKey: ["conversations"] });
          qc.invalidateQueries({ queryKey: ["chat-unread"] });
        })
        .catch((err) => !cancelled && notifyError("Unable to open chat", err))
        .finally(() => !cancelled && setLoadingRoom(false));

    join();
    socket.on("connect", join);

    return () => {
      cancelled = true;
      socket.off("connect", join);
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const onNew = (msg) => {
      if (String(msg.roomId) !== id) return;
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg],
      );
      qc.invalidateQueries({ queryKey: ["conversations"] });
      if (String(msg.senderId) !== String(user.id)) {
        emit("mark_seen", { messageId: msg._id }).catch(() => {});
      }
    };

    const onTyping = ({ userId, isTyping }) => {
      if (String(userId) !== String(user.id)) setOtherTyping(isTyping);
    };

    const onMessageSeen = ({ roomId, messageId }) => {
      if (String(roomId) !== String(id)) return;

      setMessages((prev) =>
        prev.map((m) =>
          String(m._id) === String(messageId) ? { ...m, seen: true } : m,
        ),
      );
    };

    const onAllMessageSeen = ({ roomId }) => {
      if (String(roomId) !== String(id)) return;

      setMessages((prev) =>
        prev.map((m) =>
          String(m.senderId) === String(user.id) ? { ...m, seen: true } : m,
        ),
      );
    };
    socket.on("new_message", onNew);
    socket.on("typing", onTyping);
    socket.on("message_seen", onMessageSeen);
    socket.on("messages_seen", onAllMessageSeen);

    return () => {
      socket.off("new_message", onNew);
      socket.off("typing", onTyping);
      socket.off("message_seen", onMessageSeen);
      socket.off("messages_seen", onAllMessageSeen);

      setOtherTyping(false);
    };
  }, [id, user.id]);

  useEffect(() => {
    const messageContainer = messageScrollRef.current;
    if (!messageContainer) return;

    messageContainer.scrollTo({
      top: messageContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [id, messages, otherTyping]);

  const handleSend = async ({ text, files = [] }) => {
    if (!text && files.length === 0) return;
    let attachment = null;
    try {
      if (files.length > 0) {
        attachment = await uplaodAttachment(files[0]);
      }
      clearTimeout(typingTimer.current);
      socket.emit("typing", { roomId: id, isTyping: false });
      const result = await emit("send_message", {
        roomId: id,
        text,
        attachment,
      });
      if (result?.success === false) {
        throw new Error(result.message || "Message not sent");
      }
    } catch (err) {
      notifyError("Message not sent", err);
      throw err;
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { roomId: id, isTyping: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => socket.emit("typing", { roomId: id, isTyping: false }),
      1500,
    );
  };

  const other = active?.otherUser;

  return (
    <div
      className={`theme-page mx-auto flex w-full max-h-[100dvh] overflow-hidden overscroll-none bg-white font-sans ${"h-[calc(100dvh-4rem)]"}`}
    >
      <aside
        className={`min-h-0 w-full shrink-0 flex-col lg:flex lg:w-88 ${
          id ? "hidden" : "flex"
        }`}
      >
        <div className="shrink-0 p-4 pb-0">
          <Input
            allowClear
            size="large"
            variant="filled"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<MdSearch className="text-lg text-slate-500" />}
            className="theme-input bg-indigo-50!"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {TABS.map((t) => {
              const count = inbox.filter(TAB_TEST[t.value]).length;
              return (
                <Button
                  key={t.value}
                  type="text"
                  onClick={() => setTab(t.value)}
                  className={`cursor-pointer rounded-xl px-3 py-0.5 text-xs font-medium transition-colors ${
                    tab === t.value
                      ? "bg-indigo-700! text-white!"
                      : "bg-indigo-100! text-slate-700! hover:bg-indigo-200!"
                  }`}
                >
                  {t.label}
                  {t.value !== "all" && ` (${count})`}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
          {inboxLoading && <Skeleton active />}

          {!inboxLoading && visibleInbox.length === 0 && (
            <p className="text-center text-xs text-slate-500">
              {inbox.length === 0
                ? "No conversations yet."
                : "No conversations match."}
            </p>
          )}

          {visibleInbox.map((c) => (
            <div
              key={c.roomId}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`${base}/${c.roomId}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`${base}/${c.roomId}`)
              }
              className="cursor-pointer"
              aria-current={String(c.roomId) === id ? "page" : undefined}
            >
              <InboxItem
                active={String(c.roomId) === id}
                name={c.otherUser?.name}
                role={c.otherUser?.role}
                unread={c.unreadCount || undefined}
                lastMessage={c.lastMessage}
                lastMessageAgo={c.lastMessageAt && formatDate(c.lastMessageAt)}
              />
            </div>
          ))}
        </div>
      </aside>

      <section
        className={`min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-gray-200 lg:flex ${
          id ? "flex" : "hidden"
        }`}
      >
        {id ? (
          <>
            <header className="theme-surface flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white p-3">
              <Link
                to={base}
                aria-label="Back to inbox"
                className="flex size-8 items-center justify-center rounded-lg text-xl text-slate-700 hover:bg-indigo-50 lg:hidden"
              >
                <MdArrowBack />
              </Link>
              <div className="flex shrink-0 size-10 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                {initials(other?.name ?? "?")}
              </div>
              <div className="flex justify-between items-center w-full ">
                <div className="flex items-center gap-2 text-sm flex-1">
                  <h4 className="m-0 font-semibold">
                    {other?.name ?? "Conversation"}
                  </h4>
                  {other?.role && (
                    <CustomTag
                      color={"#E0E7FF"}
                      text={other.role}
                      className=" rounded-xl! px-2! text-[11px]! capitalize"
                    />
                  )}
                </div>
                <Link
                  to={base}
                  className=" size-8 items-center justify-center rounded-lg text-xl text-slate-700 hover:bg-indigo-50 hidden lg:flex"
                >
                  <IoCloseCircle />
                </Link>
              </div>
            </header>

            <div
              ref={messageScrollRef}
              className="theme-chat-background min-h-0 flex-1 overflow-y-auto overscroll-contain bg-purple-50"
            >
              <div className="flex flex-col gap-5 p-4 sm:p-6">
                {loadingRoom && <Skeleton active />}
                {messages.map((m) => {
                  const mine = String(m.senderId) === String(user.id);
                  return (
                    <ChatMessage
                      key={m._id}
                      mine={mine}
                      message={{
                        name: mine ? user.name : other?.name,
                        role: mine ? undefined : other?.role,
                        time: formatDate(m.createdAt),
                        attachment: m.attachment,
                        text: m.text,
                        seen: m.seen,
                      }}
                    />
                  );
                })}
                {otherTyping && (
                  <p className="m-0 text-xs italic text-slate-500">
                    {other?.name ?? "Someone"} is typing...
                  </p>
                )}
              </div>
            </div>

            <div className="theme-surface sticky bottom-0 z-10 shrink-0 border-t border-slate-200 bg-white">
              <ChatInput onSend={handleSend} onTyping={handleTyping} />
            </div>
          </>
        ) : (
          <div className="theme-chat-background flex flex-1 flex-col items-center justify-center gap-2 bg-purple-50 text-slate-500">
            <MdOutlineChat className="text-4xl" />
            <p className="m-0 text-sm">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Chat;
