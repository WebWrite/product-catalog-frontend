import { useRef, useEffect } from "react";
import { Tag } from "antd";
import { MdClose } from "react-icons/md";

const ROLE_COLORS = {
  Admin: "purple",
  Seller: "blue",
  Customer: "green",
};

const Field = ({ label, value }) => (
  <div className="min-w-0">
    <p className="mb-1 text-xs text-slate-400">{label}</p>
    <p className="break-words text-sm font-semibold text-slate-200">
      {value || "-"}
    </p>
  </div>
);

const ActivityDetailsCard = ({ activity, onClose }) => {
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
      <div className="flex items-center justify-between gap-3 border-b border-slate-500/30 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-500 text-base font-bold text-white sm:h-12 sm:w-12 sm:text-lg">
            {activity.user?.initials || "U"}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-base font-bold text-slate-100 sm:text-lg">
                {activity.user?.name || "Unknown user"}
              </h3>

              {ROLE_COLORS[activity.role] && (
                <Tag
                  color={ROLE_COLORS[activity.role]}
                  style={{ margin: 0, borderRadius: 999 }}
                >
                  {activity.role}
                </Tag>
              )}
            </div>

            <p className="break-all text-sm text-slate-400">
              {activity.user?.email || "-"}
            </p>
          </div>
        </div>

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
          <Field label="Log ID" value={activity.logId} />
        </div>

        <div className="mb-6">
          <p className="mb-1 text-xs text-slate-400">What happened</p>
          <p className="break-words text-sm text-slate-200">
            {activity.description || "-"}
          </p>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs text-slate-400">Metadata</p>

          <pre className="max-w-full overflow-x-auto rounded-lg border border-slate-500/30 bg-slate-500/10 p-3 font-mono text-xs text-slate-300 sm:p-4 sm:text-sm">
            {JSON.stringify(activity.metadata ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsCard;
