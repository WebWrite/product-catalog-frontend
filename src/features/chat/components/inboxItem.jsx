import { Badge } from "antd";
import CustomTag from "../../../shared/components/customTag";
import { initials } from "../../../shared/utils/initialsName";

function InboxItem({ active, unread, name, role }) {
  return (
    <div
      className={`mt-2 flex gap-2 rounded-2xl border p-3 transition-colors ${
        active
          ? "border-indigo-300 bg-indigo-100 shadow-sm ring-1 ring-indigo-200"
          : unread > 0
            ? "border-transparent bg-violet-100"
            : "border-transparent bg-gray-50 hover:bg-indigo-50"
      }`}
    >
      <div className="rounded-full shrink-0 bg-gray-200 h-10 w-10 flex items-center justify-center text-xs font-semibold">
        {initials(name)}
      </div>
      <div className=" flex flex-col items-center ">
        <div className="text-sm   ">
          <h2 className="font-semibold">{name}</h2>
          <CustomTag
            className={"bg-indigo-100! rounded-xl! px-2! text-[11px]! "}
            text={role}
          />
        </div>
      </div>
      <div className="flex items-end flex-1 flex-col justify-start gap-2">
        <span>{unread && <Badge count={unread} color="#4f46e5" />}</span>
      </div>
    </div>
  );
}

export default InboxItem;
