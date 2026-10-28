import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Input } from "antd";
import { MdArrowBack, MdOutlineChat, MdSearch } from "react-icons/md";
import CustomTag from "../../../shared/components/customTag";
import InboxItem from "../components/inboxItem";
import ChatMessage from "../components/chatMessage";
import ChatInput from "../components/chatInput";
import { initials } from "../../../shared/utils/initialsName";

const INBOX = [
  { id: 1, name: "John Smith", role: "customer", unread: "21" },
  { id: 2, name: "John Smith", role: "customer", unread: "21" },
  { id: 3, name: "John Smith", role: "customer", unread: "21" },
  { id: 4, name: "John Smith", role: "customer", unread: "21" },
  { id: 5, name: "John Smith", role: "customer", unread: "21" },
  { id: 6, name: "John Smith", role: "customer", unread: "21" },
  { id: 7, name: "John Smith", role: "customer", unread: "21" },
  { id: 8, name: "John Smith", role: "Admin" },
  { id: 9, name: "John Smith", role: "customer" },
];

const MESSAGES = [
  {
    id: 1,
    senderId: "elena",
    name: "Elena Vance",
    time: "10:15 AM",
    text: "Hello Hiroshi-san! I just placed order #AUR-89421 for the Tenmoku dripper from Batch #19. So thrilled to finally acquire one of your works after following the firing logs!",
  },
  {
    id: 2,
    senderId: "hiroshi",
    name: "Hiroshi Tanaka",
    role: "Admin",
    time: "10:45 AM",
    text: "Konnichiwa Elena! Thank you sincerely for supporting Studio Kanso. Batch #19 came out of the Noborigama climbing kiln with extraordinary crystal vitrification and iron blossom bloom. We are currently inspecting and diamond-polishing the foot rim of each serialized piece.",
  },
];

const FILTER_TAG = "bg-indigo-100! rounded-xl! px-3! text-xs! py-0.5!";

function Chat() {
  const { pathname } = useLocation();
  const base = pathname.split("/chat")[0] + "/chat";
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const active = INBOX.find((c) => String(c.id) === id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id, MESSAGES.length]);

  return (
    <div className="mx-auto flex h-screen w-full overflow-hidden bg-white font-sans">
      <aside
        className={`min-h-0 w-full shrink-0 flex-col lg:flex lg:w-88 ${
          active ? "hidden" : "flex"
        }`}
      >
        <div className="shrink-0 p-4 pb-0">
          <Input
            allowClear
            size="large"
            variant="filled"
            placeholder="Filter items..."
            prefix={<MdSearch className="text-lg text-slate-500" />}
            className="bg-indigo-50!"
          />

          <div className="mt-4 flex items-center gap-4 text-black">
            <CustomTag text="All" className={FILTER_TAG} />
            <CustomTag text="UnRead" className={FILTER_TAG} />
            <CustomTag text="Admin" className={FILTER_TAG} />
          </div>
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {INBOX.map((c) => (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`${base}/${c.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`${base}/${c.id}`)
              }
              className="cursor-pointer"
            >
              <InboxItem
                name={c.name}
                role={c.role}
                unread={c.unread}
                lastMessage="you please add the artisan kanji inscription on the paulownia box?"
                lastMessageAgo="12 min ago"
              />
            </div>
          ))}
        </div>
      </aside>

      <section
        className={`min-h-0 min-w-0 flex-1 flex-col border-l border-gray-200 lg:flex ${
          active ? "flex" : "hidden"
        }`}
      >
        {active ? (
          <>
            <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white p-3">
              <Link
                to={base}
                aria-label="Back to inbox"
                className="flex size-8 items-center justify-center rounded-lg text-xl text-slate-700 hover:bg-indigo-50 lg:hidden"
              >
                <MdArrowBack />
              </Link>
              <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                {initials(active.name)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <h4 className="m-0 font-semibold">{active.name}</h4>
                <CustomTag
                  text={active.role}
                  className="bg-indigo-100! rounded-xl! px-2! text-[11px]! capitalize"
                />
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-purple-50">
              <div className="flex flex-col gap-5 p-4 sm:p-6">
                {MESSAGES.map((m) => (
                  <ChatMessage
                    key={m.id}
                    message={m}
                    mine={m.senderId === "hiroshi"}
                  />
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="shrink-0">
              <ChatInput />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-purple-50 text-slate-500">
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
