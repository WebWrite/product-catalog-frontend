import { Avatar, Badge, Button, Dropdown, Input } from "antd";
import { AiOutlineAmazon } from "react-icons/ai";
import {
  FaHeart,
  FaRegUser,
  FaRegUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { TfiSearch, TfiShoppingCart } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../../../app/store/user/userSlice";

function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(removeUser());
    navigate("/");
  };

  const loggedInItems = [
    {
      key: "greeting",
      label: (
        <div className="py-2 font-raleway">
          <p className="m-0 text-sm text-white">
            Hello,
            <span className="ml-1 font-semibold">{user?.name}</span>
          </p>
        </div>
      ),
      disabled: true,
    },

    {
      type: "divider",
    },

    {
      label: <p className="m-0 text-sm font-sans">Profile</p>,
      key: "profile",
      icon: <FaRegUserCircle className="size-3" />,
      onClick: () => navigate("/profile"),
    },

    {
      label: <p className="m-0 text-sm font-sans">Logout</p>,
      key: "logout",
      icon: <FaSignOutAlt className="size-3" />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const guestItems = [
    {
      key: "greeting",
      label: (
        <div className="py-2 font-raleway">
          <p className="m-0 text-sm text-white">
            Hello,
            <span className="ml-1 font-semibold">Guest</span>
          </p>
        </div>
      ),
      disabled: true,
    },

    {
      type: "divider",
    },

    {
      label: "Login",
      key: "login",
      icon: <FaSignInAlt />,
      onClick: () => navigate("/auth/login"),
    },

    {
      label: "Register",
      key: "register",
      icon: <FaUser />,
      onClick: () => navigate("/auth/register"),
    },
  ];

  return (
    <header
      className="
        sticky
        top-0
        z-50
        flex
        h-18
        items-center
        justify-between
        gap-10
        border-b
        border-gray-900
        bg-black
        px-10
        shadow-sm
      "
    >
      <div className="flex shrink-0 items-center justify-start gap-2">
        <Link to="/">
          <Avatar
            className="bg-amber-700!"
            size={40}
            icon={<AiOutlineAmazon />}
          />
        </Link>

        <h3 className="m-0 text-sm font-semibold font-raleway">Amazon</h3>
      </div>

      <Input
        placeholder="Search products..."
        prefix={<TfiSearch />}
        className="w-64!"
      />

      <div className="flex items-center gap-3">
        <Button
          type="text"
          onClick={() => navigate("/favourites")}
          className="
            flex!
            items-center
            gap-2
            px-2!
            hover:text-red-500!
          "
          icon={<FaHeart className="size-4" />}
        >
          <span className="hidden md:inline">Favourite</span>
        </Button>
        <Link to="/cart">
          <Badge count={0} showZero>
            <Button icon={<TfiShoppingCart className="size-4" />} />
          </Badge>
        </Link>

        <Dropdown
          menu={{
            items: user ? loggedInItems : guestItems,
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button
            type="text"
            className="
              flex!
              items-center
              gap-2
              px-2!
            "
          >
            <FaRegUser className="size-4" />

            <span className="hidden text-sm font-medium sm:inline">
              {user?.name || "Guest"}
            </span>
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}

export default NavBar;
