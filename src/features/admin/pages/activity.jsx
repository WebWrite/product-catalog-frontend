import { useEffect, useState } from "react";
import { Table, Pagination, Tag, ConfigProvider, theme } from "antd";
import { useQuery } from "@tanstack/react-query";
import ActivityFilters from "../components/activityFilters";
import ActivityDetailsCard from "../components/activityDetailsCard";
import { getAdminActivityLogs } from "../api/api";

const EMPTY_FILTERS = {
  search: "",
  role: "all",
  target: "all",
  range: null,
};

const PAGE_SIZE = 20;

const ROLE_COLORS = {
  Admin: "purple",
  Seller: "blue",
  Customer: "green",
};

const getMode = () => {
  const element = document.querySelector("[data-theme]");

  if (element) return element.getAttribute("data-theme");

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const useThemeMode = () => {
  const [mode, setMode] = useState(getMode);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMode(getMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  return mode;
};

const formatRole = (role = "") =>
  role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

const formatAction = (action = "") =>
  action
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Activity = () => {
  const mode = useThemeMode();
  const isDark = mode === "dark";

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dateFrom = filters.range?.[0]?.format("YYYY-MM-DD");
  const dateTo = filters.range?.[1]?.format("YYYY-MM-DD");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "adminActivityLogs",
      filters.search,
      filters.role,
      filters.target,
      dateFrom,
      dateTo,
      currentPage,
      PAGE_SIZE,
    ],
    queryFn: () =>
      getAdminActivityLogs({
        search: filters.search.trim() || undefined,
        role: filters.role === "all" ? undefined : filters.role,
        target: filters.target === "all" ? undefined : filters.target,
        dateFrom,
        dateTo,
        page: currentPage,
        limit: PAGE_SIZE,
      }),
  });

  const logs = data?.logs ?? [];
  const pagination = data?.pagination;

  const activities = logs.map((log) => {
    const name = log.user?.name || "Unknown user";

    return {
      id: log._id,
      time: log.createdAt ? new Date(log.createdAt).toLocaleString() : "-",
      user: {
        name,
        email: log.user?.email || "-",
        initials: name
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      },
      role: formatRole(log.role || log.user?.role || ""),
      action: formatAction(log.action),
      target: log.target || "-",
      status: log.status || "-",
      requestId: log.requestId || "-",
      logId: log._id,
      description: log.message || "-",
      metadata: log.metadata || {},
    };
  });

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
    setSelectedActivity(null);
  };

  const handleReset = () => {
    setFilters({ ...EMPTY_FILTERS });
    setCurrentPage(1);
    setSelectedActivity(null);
  };

  const columns = [
    {
      title: "TIME",
      dataIndex: "time",
      key: "time",
      width: 190,
      render: (text) => (
        <span className="whitespace-nowrap font-medium">{text}</span>
      ),
    },
    {
      title: "USER",
      key: "user",
      width: 240,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {record.user.initials}
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="whitespace-nowrap text-sm font-medium">
              {record.user.name}
            </span>
            <span className="whitespace-nowrap text-xs opacity-60">
              {record.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      width: 110,
      render: (role) =>
        ROLE_COLORS[role] ? (
          <Tag
            color={ROLE_COLORS[role]}
            style={{ margin: 0, borderRadius: 999 }}
          >
            {role}
          </Tag>
        ) : (
          <span>{role || "-"}</span>
        ),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      width: 180,
      render: (text) => <span className="whitespace-nowrap">{text}</span>,
    },
    {
      title: "TARGET",
      dataIndex: "target",
      key: "target",
      width: 120,
    },
  ];

  const total = pagination?.total ?? 0;
  const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? "#6366f1" : "#5b5bd6",
          colorBgContainer: isDark ? "#111a2c" : "#ffffff",
          colorBorder: isDark ? "#2a3650" : "#d5dbe8",
          colorText: isDark ? "#e2e8f0" : "#1e293b",
          colorTextPlaceholder: isDark ? "#8a97ae" : "#64748b",
          borderRadius: 10,
        },
        components: {
          Table: {
            colorBgContainer: "transparent",
            headerBg: isDark ? "#1a2538" : "#f1f5f9",
            headerColor: isDark ? "#94a3b8" : "#64748b",
            borderColor: isDark ? "#26324a" : "#e4e8f1",
            rowHoverBg: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(15,23,42,0.04)",
          },
        },
      }}
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl p-3 sm:p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-slate-100 sm:text-3xl">
            Activity Logs
          </h1>
          <p className="text-sm text-slate-400 sm:text-base">
            Review administrative activity and select a row to see its details.
          </p>
        </div>

        <ActivityFilters
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleReset}
        />

        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-500/30 bg-[var(--workspace-surface)]">
          {isError ? (
            <div className="p-6 text-center text-red-400">
              {error?.message || "Failed to load activity logs."}
            </div>
          ) : (
            <>
              <div className="w-full min-w-0 overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={activities}
                  rowKey="id"
                  loading={isLoading}
                  pagination={false}
                  scroll={{ x: 840 }}
                  locale={{ emptyText: "No activity logs found" }}
                  onRow={(record) => ({
                    onClick: () => setSelectedActivity(record),
                    className: `cursor-pointer ${
                      selectedActivity?.id === record.id
                        ? "[&>td]:!bg-indigo-500/10"
                        : ""
                    }`,
                  })}
                />
              </div>

              <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-500/30 p-3 sm:flex-row sm:items-center sm:p-4">
                <span className="text-sm text-slate-400">
                  Showing {start}–{end} of {total} entries
                </span>

                <div className="max-w-full overflow-x-auto">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={PAGE_SIZE}
                    onChange={(page) => {
                      setCurrentPage(page);
                      setSelectedActivity(null);
                    }}
                    showSizeChanger={false}
                    responsive
                    showLessItems
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <ActivityDetailsCard
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      </div>
    </ConfigProvider>
  );
};

export default Activity;
