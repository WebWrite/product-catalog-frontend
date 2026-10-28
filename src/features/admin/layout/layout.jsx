import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  ConfigProvider,
  theme,
  notification,
} from "antd";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdMessage,
  MdSettings,
  MdNotificationsNone,
  MdMenu as MdMenuIcon,
  MdLogout,
  MdPerson,
  MdKeyboardArrowDown,
  MdSearch,
  MdViewInAr,
  MdSupervisedUserCircle,
} from "react-icons/md";
import { logout } from "../../../shared/utils/api";
import { removeUser } from "../../../app/store/user/userSlice";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { clearLoginMarker } from "../../../shared/utils/authStorage";
import { useTheme } from "../../../app/theme/useTheme";
import ThemeToggle from "../../../shared/components/themeToggle";
import { useUnreadCount } from "../../chat/hooks/useChat";

const { Sider, Content } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const unreadCount = useUnreadCount();

  const { isDarkMode } = useTheme();
  const handleLogout = async () => {
    const res = await logout();
    if (res.status === 200) {
      clearLoginMarker();
      dispatch(removeUser());
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/");
      notification.success({
        title: "Logout successfully",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    }
  };

  const user = {
    name: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohsin",
  };

  const MENU_ITEMS = [
    {
      key: "/admin/dashboard",
      icon: <MdDashboard size={18} />,
      label: <Link to="/admin/dashboard">Overview</Link>,
    },
    {
      key: "/admin/products",
      icon: <MdInventory size={18} />,
      label: <Link to="/admin/products">Products</Link>,
    },
    {
      key: "/admin/orders",
      icon: <MdShoppingCart size={18} />,
      label: <Link to="/admin/orders">Orders</Link>,
    },
    {
      key: "/admin/sellers",
      icon: <MdSupervisedUserCircle size={18} />,
      label: <Link to="/admin/sellers">Sellers</Link>,
    },
    {
      key: "/admin/customers",
      icon: <MdSupervisedUserCircle size={18} />,
      label: <Link to="/admin/customers">Users / Customer</Link>,
    },
    {
      key: "/admin/chat",
      icon: <MdMessage size={18} />,
      label: (
        <Link to="/admin/chat">
          Messages
          <Badge
            count={unreadCount.data}
            className="ml-4!"
            color="#4f46e5"
          ></Badge>
        </Link>
      ),
    },
    {
      key: "/admin/settings",
      icon: <MdSettings size={18} />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <MdPerson />,
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      icon: <MdLogout />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) setCollapsed(true);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: [
          isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          theme.compactAlgorithm,
        ],
        token: {
          colorPrimary: "#6366F1",
          colorBgContainer: isDarkMode ? "#1E293B" : "#FFFFFF",
          colorBorder: isDarkMode ? "#334155" : "#E4E9F2",
          colorText: isDarkMode ? "#F1F5F9" : "#172033",
          colorTextSecondary: isDarkMode ? "#94A3B8" : "#667085",
          fontFamily: "inherit",
          borderRadius: 8,
        },
        components: {
          Layout: {
            siderBg: isDarkMode ? "#0F172A" : "#FFFFFF",
            bodyBg: isDarkMode ? "#0F172A" : "#F6F8FC",
          },
          Menu: {
            darkItemBg: "transparent",
            darkItemSelectedBg: "#4F46E5",
            darkItemSelectedColor: "#FFFFFF",
            darkItemColor: isDarkMode ? "#94A3B8" : "#667085",
            darkItemHoverBg: isDarkMode ? "#1E293B" : "#EEF2FF",
            darkItemHoverColor: isDarkMode ? "#F1F5F9" : "#172033",
            itemHeight: 44,
            itemMarginInline: 12,
            itemBorderRadius: 8,
          },
          Table: {
            headerBg: isDarkMode ? "#1E293B" : "#FFFFFF",
            headerColor: isDarkMode ? "#94A3B8" : "#667085",
            rowHoverBg: isDarkMode ? "#334155" : "#F6F8FC",
            borderColor: isDarkMode ? "#334155" : "#E4E9F2",
            colorBgContainer: isDarkMode ? "#1E293B" : "#FFFFFF",
            colorText: isDarkMode ? "#F1F5F9" : "#172033",
          },
        },
      }}
    >
      <div
        className="seller-admin-shell min-h-screen font-sans flex w-full overflow-x-hidden"
        style={{ background: "var(--workspace-bg)" }}
      >
        {isMobile && !collapsed && (
          <div
            className="fixed inset-0 bg-black/60 z-20 backdrop-blur-sm"
            onClick={() => setCollapsed(true)}
          />
        )}

        <Sider
          width={260}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={isMobile ? 0 : 80}
          trigger={null}
          className={`fixed left-0 top-0 bottom-0 z-30 border-r border-slate-800 ${isMobile && collapsed ? "-translate-x-full" : "translate-x-0"} transition-transform duration-300`}
          style={{ position: "fixed", height: "100vh", overflow: "auto" }}
        >
          <div
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-6"} py-6 mb-2`}
          >
            <Link
              to="/admin/dashboard"
              className="flex shrink-0 items-center gap-2"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
                <MdViewInAr />
              </span>

              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-100 leading-none tracking-tight">
                    Aura
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
                    Marketplace
                  </span>
                </div>
              )}
            </Link>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={MENU_ITEMS}
            theme={isDarkMode ? "dark" : "light"}
            onClick={handleMenuClick}
          />

          {!collapsed && (
            <div className="absolute bottom-0 w-full p-5 border-t border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-2 font-medium">
                <span>Storage & Quota</span>
                <span className="font-bold text-slate-200">84%</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-5">
                <div className="bg-indigo-500 h-full w-[84%]"></div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold m-0 text-slate-100">
                    Studio Kanso
                  </p>
                  <p className="text-[10px] text-slate-500 m-0 font-medium">
                    Kyoto, JP
                  </p>
                </div>
                <MdSettings className="text-slate-500 cursor-pointer hover:text-indigo-400" />
              </div>
            </div>
          )}
        </Sider>

        <div
          className="flex flex-col flex-1 min-h-screen min-w-0"
          style={{
            marginLeft: isMobile ? 0 : collapsed ? 80 : 260,
            transition: "all 0.2s",
            background: "var(--workspace-bg)",
          }}
        >
          <header
            className="sticky top-0 z-20 w-full border-b border-slate-800"
            style={{ background: "var(--workspace-surface)" }}
          >
            <div className="h-16 px-3 md:px-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <MdMenuIcon size={20} />
                </button>
                <span className="text-xs text-slate-500 hidden xl:block font-medium whitespace-nowrap">
                  Admin Console / Overview
                </span>
              </div>

              <div className="hidden lg:flex items-center justify-center flex-1">
                <div className="flex items-center bg-slate-800 rounded-lg px-3 py-3.5 border border-slate-700 w-64 xl:w-96">
                  <MdSearch
                    size={16}
                    className="text-slate-500 mr-2 shrink-0"
                  />

                  <input
                    type="text"
                    placeholder="Search orders, products, collectors..."
                    className="w-full min-w-0 bg-transparent border-none outline-none ring-0 shadow-none text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                <ThemeToggle />
                <Badge
                  count={unreadCount.data}
                  color="blue"
                  size="small"
                  offset={[-2, 2]}
                >
                  <MdNotificationsNone
                    size={22}
                    className="text-slate-400 cursor-pointer hover:text-indigo-400 transition-colors"
                  />
                </Badge>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 px-1.5 py-1 rounded-full border border-slate-700 transition-colors">
                    <Avatar
                      src={user.avatar}
                      size={28}
                      className="bg-indigo-600"
                    />
                    <span className="text-xs font-bold text-slate-200 hidden xl:block pr-1">
                      {user.name}
                    </span>
                    <MdKeyboardArrowDown
                      className="text-slate-500 hidden xl:block"
                      size={16}
                    />
                  </div>
                </Dropdown>
              </div>
            </div>
          </header>

          <Content className="">
            <Outlet />
          </Content>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default AdminLayout;
