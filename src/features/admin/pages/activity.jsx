import { useState } from "react";
import { Table, Pagination, Input, Select, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "../api/api";
import LogDetails from "../components/logDetails";
import { useDebounce } from "../../../shared/hooks/useDebounce";

const EMPTY_FILTERS = {
  target: "all",
};

const PAGE_SIZE = 20;

const TARGET_OPTIONS = [
  { value: "all", label: "All targets" },
  { value: "Auth", label: "Auth" },
  { value: "Product", label: "Product" },
  { value: "Order", label: "Order" },
  { value: "Seller", label: "Seller" },
];

const formatAction = (action = "") =>
  action
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Activity = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "activityLogs",
      debouncedSearch,
      filters.target,
      currentPage,
      PAGE_SIZE,
    ],
    queryFn: () =>
      getActivityLogs({
        search: debouncedSearch.trim() || undefined,
        target: filters.target === "all" ? undefined : filters.target,
        page: currentPage,
        limit: PAGE_SIZE,
      }),
    refetchOnWindowFocus: false,
  });

  const logs = data?.logs ?? [];
  const pagination = data?.pagination;

  const activities = logs.map((log) => ({
    id: log._id,
    time: log.createdAt ? new Date(log.createdAt).toLocaleString() : "-",
    action: formatAction(log.action),
    target: log.target || "-",
    status: log.status || "-",
    requestId: log.requestId || "-",
    logId: log._id,
    description: log.message || "-",
  }));

  const resetPage = () => {
    setCurrentPage(1);
    setSelectedActivity(null);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    resetPage();
  };

  const handleTargetChange = (value) => {
    setFilters((prev) => ({ ...prev, target: value }));
    resetPage();
  };

  const handleReset = () => {
    setFilters({ ...EMPTY_FILTERS });
    setSearchInput("");
    resetPage();
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
    <div className="mx-auto w-full min-w-0 max-w-7xl p-3 sm:p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-slate-100 sm:text-3xl">
          Activity Log
        </h1>
        <p className="text-sm text-slate-400 sm:text-base">
          Review activity and select a row to see its details.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search activity..."
          allowClear
          className="w-full sm:max-w-sm"
        />

        <Select
          value={filters.target}
          onChange={handleTargetChange}
          options={TARGET_OPTIONS}
          className="w-full sm:w-48"
        />

        <Button onClick={handleReset}>Reset</Button>
      </div>

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
                className=" [&_.ant-table-thead>tr>th]:text-[10px]! [&_.ant-table-thead>tr>th]:font-semibold! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-tbody>tr.row-active>td]:bg-indigo-50! [&_.ant-table-tbody>tr.row-inactive>td]:bg-red-50/60! [&_.ant-table-thead>tr>th]:p-4!"
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

      <LogDetails
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default Activity;
