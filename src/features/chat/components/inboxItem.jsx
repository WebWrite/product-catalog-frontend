import { Badge } from "antd";
import CustomTag from "../../../shared/components/customTag";
import { initials } from "../../../shared/utils/initialsName";

function InboxItem({ unread, name, role, lastMessageAgo, lastMessage }) {
  return (
    <div
      className={`mt-2 flex gap-2 p-3 ${unread >= 0 && "rounded-2xl bg-violet-100 "}`}
    >
      <div className="rounded-full shrink-0 bg-gray-200 h-10 w-10 flex items-center justify-center text-xs font-semibold">
        {initials(name)}
      </div>
      <div className=" ">
        <div className="text-sm   flex items-center gap-2">
          <h2 className="font-semibold">{name}</h2>
          <CustomTag
            className={"bg-indigo-100! rounded-xl! px-2! text-[11px]! "}
            text={role}
          />
        </div>
        <div className="mt-2">
          <p className="w-40 line-clamp-2">{lastMessage}</p>
        </div>
      </div>
      <div className="flex items-end flex-col justify-start gap-2">
        <p className="text-indigo-600 font-semibold">{lastMessageAgo}</p>
        <span>{unread && <Badge count={unread} color="#4f46e5" />}</span>
      </div>
    </div>
  );
}

export default InboxItem;
