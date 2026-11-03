import { useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";

const Field = ({ label, value }) => (
  <div className="min-w-0">
    <p className="mb-1 text-xs text-slate-400">{label}</p>
    <p className="break-words text-sm font-semibold text-slate-200">
      {value || "-"}
    </p>
  </div>
);

const LogDetails = ({ activity, onClose }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (activity && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activity]);

  if (!activity) return null;

  return (
    <div
      ref={cardRef}
      className="mt-6 min-w-0 overflow-hidden rounded-xl border"
      style={{
        background: "var(--workspace-surface)",
        borderColor: "var(--workspace-border)",
      }}
    >
      <div className="flex items-center justify-end gap-3 border-b border-slate-500/30 p-1 ">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-500/20"
        >
          <MdClose size={20} />
        </button>
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <Field label="Action" value={activity.action} />
          <Field label="Target" value={activity.target} />
          <Field label="Time" value={activity.time} />
          <Field label="Request ID" value={activity.requestId} />
        </div>

        <div className="mb-6">
          <p className="mb-1 text-xs text-slate-400">What happened</p>
          <p className="break-words text-sm text-slate-200">
            {activity.description || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogDetails;
