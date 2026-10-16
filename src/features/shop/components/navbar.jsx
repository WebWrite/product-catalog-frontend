import { useState } from "react";
import {
  App,
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Input,
  Select,
  Switch,
} from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaMoon,
  FaSun,
  FaRegUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import {
  MdMenu,
  MdOutlineFavoriteBorder,
  MdOutlineShoppingBag,
  MdSearch,
  MdViewInAr,
} from "react-icons/md";
import { removeUser } from "../../../app/store/user/userSlice";
import { useTheme } from "../../../app/theme/useTheme";
import { logout } from "../../../shared/utils/api";

const NAV_LINKS = [
  { label: "Home", to: "/", end: true },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "New Arrivals", to: "/new-arrivals" },
];

const SEARCH_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "Clothing", label: "Fashion & Clothing" },
  { value: "Electronics", label: "Electronic Devices" },
  { value: "Beauty", label: "Beauty & Personal Care" },
  { value: "Furniture", label: "Home & Furniture" },
  { value: "Sports", label: "Sports & Outdoors" },
  { value: "Toys", label: "Toys & Games" },
  { value: "Food", label: "Food & Groceries" },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-2 py-2 text-xs font-semibold font-sans transition-colors ${
    isActive
      ? "bg-indigo-500! text-white!"
      : "text-slate-500! hover:bg-indigo-50"
  }`;

function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const user = useSelector((state) => state.user);
  const { isDarkMode, toggleTheme } = useTheme();

  const favCount = 0;
  const isloogedIn = useSelector((state) => !!state.user?.email);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (category !== "all") params.set("category", category);
    setDrawerOpen(false);
    navigate(`/shop?${params.toString()}`);
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res.status === 200) {
      dispatch(removeUser());
      navigate("/");
      notification.success({
        title: "Logout successfully",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    }
  };

  const themeItem = {
    key: "theme",
    label: isDarkMode ? "Light mode" : "Dark mode",
    icon: isDarkMode ? (
      <FaSun className="size-3" />
    ) : (
      <FaMoon className="size-3" />
    ),
    onClick: toggleTheme,
  };

  const loggedInItems = [
    {
      key: "greeting",
      label: (
        <p className="theme-heading m-0 py-1 text-xs">
          Hello, <span className="font-semibold">{user?.name}</span>
        </p>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "profile",
      label: "Profile",
      icon: <FaRegUserCircle className="size-3" />,
      onClick: () => navigate("/profile"),
    },
    themeItem,
    {
      key: "logout",
      label: "Logout",
      icon: <FaSignOutAlt className="size-3" />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const guestItems = [
    {
      key: "greeting",
      label: (
        <p className="theme-heading m-0 py-1 text-xs">
          Hello, <span className="font-semibold">Guest</span>
        </p>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "login",
      label: "Login",
      icon: <FaSignInAlt />,
      onClick: () => navigate("/auth/login"),
    },
    {
      key: "register",
      label: "Register",
      icon: <FaUser />,
      onClick: () => navigate("/auth/register"),
    },
    themeItem,
  ];

  const iconButtonClass = "h-9! w-9! rounded-lg! border-slate-200!";

  return (
    <header className="theme-navbar sticky top-0 font-sans z-50 flex h-16 items-center justify-between gap-4 border-b px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
            <MdViewInAr />
          </span>
          <span className="theme-heading text-lg font-bold">Aura</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="hidden h-10 w-full max-w-md items-center rounded-xl border border-slate-200 bg-white pr-2 md:flex">
        <Select
          value={category}
          onChange={setCategory}
          options={SEARCH_CATEGORIES}
          variant="borderless"
          className="w-24 text-xs"
          popupMatchSelectWidth={false}
        />
        <span className="h-5 w-px bg-slate-200" />
        <Input
          variant="borderless"
          style={{ boxShadow: "none", outline: "none" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="Search curated goods, designers, collections"
          prefix={<MdSearch className="text-lg text-slate-500" />}
          suffix={
            <kbd className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
              ⌘ K
            </kbd>
          }
        />
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <Badge count={favCount} size="small" color="#4f46e5">
          <Button
            className={iconButtonClass}
            onClick={() => navigate("/favourites")}
            aria-label="Favourites"
            icon={<MdOutlineFavoriteBorder className="text-lg" />}
          />
        </Badge>

        <Badge
          count={isloogedIn ? user?.cart : cartCount}
          size="small"
          color="#4f46e5"
        >
          <Button
            className={iconButtonClass}
            onClick={() => navigate("/cart")}
            aria-label="Cart"
            icon={<MdOutlineShoppingBag className="text-lg" />}
          />
        </Badge>

        <Dropdown
          menu={{ items: user ? loggedInItems : guestItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <button
            type="button"
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 transition-colors ${
              isDarkMode ? "hover:bg-indigo-950" : "hover:bg-indigo-50"
            }`}
          >
            <span className="theme-heading hidden text-xs font-semibold xl:inline">
              {user?.name || "Guest"}
            </span>
            <Avatar src={user?.avatar} size={34} className="bg-indigo-600!">
              {(user?.name || "G").charAt(0).toUpperCase()}
            </Avatar>
          </button>
        </Dropdown>
      </div>

      <div className="flex items-center gap-3 md:hidden">
        <Badge
          count={isloogedIn ? user?.cart : cartCount}
          size="small"
          color="#4f46e5"
        >
          <Button
            className={iconButtonClass}
            onClick={() => navigate("/cart")}
            icon={<MdOutlineShoppingBag className="text-lg" />}
          />
        </Badge>
        <Button
          className={iconButtonClass}
          onClick={() => setDrawerOpen(true)}
          icon={<MdMenu className="text-lg" />}
        />
      </div>

      <Drawer
        size={260}
        title={`Hello, ${user?.name || "Guest"}`}
        mask={{ enabled: true, blur: true }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="Search products..."
          prefix={<MdSearch className="text-lg" />}
        />

        <nav className="mt-4 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={linkClass}
              onClick={() => setDrawerOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm">Dark mode</span>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren={<FaMoon />}
            unCheckedChildren={<FaSun />}
            aria-label="Toggle dark mode"
          />
        </div>

        <Button
          className="mt-3 w-full!"
          onClick={() => {
            setDrawerOpen(false);
            navigate("/favourites");
          }}
          icon={<MdOutlineFavoriteBorder />}
        >
          Favourites
        </Button>

        {user ? (
          <>
            <Button
              className="mt-2 w-full!"
              onClick={() => {
                setDrawerOpen(false);
                navigate("/profile");
              }}
              icon={<FaRegUserCircle className="size-3" />}
            >
              Profile
            </Button>
            <Button
              danger
              className="mt-2 w-full!"
              onClick={handleLogout}
              icon={<FaSignOutAlt className="size-3" />}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              className="mt-2 w-full!"
              onClick={() => navigate("/auth/login")}
              icon={<FaSignInAlt className="size-3" />}
            >
              Login
            </Button>
            <Button
              type="primary"
              className="mt-2 w-full!"
              onClick={() => navigate("/auth/register")}
              icon={<FaUser className="size-3" />}
            >
              Register
            </Button>
          </>
        )}
      </Drawer>
    </header>
  );
}

export default NavBar;
