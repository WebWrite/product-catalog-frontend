import { initials } from "../../../shared/utils/initialsName";

function ChatMessage({ message, mine = false }) {
  const { name, role, time, text, avatar } = message;

  return (
    <div
      className={`flex w-full gap-2.5 ${mine ? "justify-end" : "justify-start"}`}
    >
      {!mine && (
        <span className="mt-1 flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            initials(name)
          )}
        </span>
      )}

      <div
        className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${mine ? "items-end" : "items-start"}`}
      >
        <p className="m-0 mb-1.5 flex flex-wrap items-center gap-2 text-[11px]">
          {mine ? (
            <>
              <span className="text-[10px] font-semibold text-slate-500">
                {time}
              </span>
              <span className="font-bold text-slate-900">{name}</span>
              {role && (
                <span className="text-[10px] text-indigo-600">({role})</span>
              )}
            </>
          ) : (
            <>
              <span className="font-bold text-slate-900">{name}</span>
              <span className="text-[10px] font-semibold text-slate-500">
                {time}
              </span>
            </>
          )}
        </p>

        <div
          className={`whitespace-pre-line px-4 py-3 text-sm leading-relaxed shadow-sm ${
            mine
              ? "rounded-2xl rounded-br-sm bg-indigo-800 text-white"
              : "rounded-2xl rounded-tl-sm bg-white text-slate-800 ring-1 ring-slate-100"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
