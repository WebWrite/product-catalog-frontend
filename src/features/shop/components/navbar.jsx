import { Avatar, Button, Dropdown, Input } from "antd";
import { AiOutlineAmazon } from "react-icons/ai";
import {
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
          <p className="text-sm text-white m-0">
            Hello,
            <span className="font-semibold  m-0 ml-1 ">{user?.name}</span>
          </p>
        </div>
      ),
      disabled: true,
    },

    {
      type: "divider",
    },

    {
      label: <p className="text-sm font-sans"> Profile</p>,
      key: "profile",
      icon: <FaRegUserCircle className="size-3" />,
      onClick: () => navigate("/profile"),
    },

    {
      label: <p className="text-sm font-sans"> Logout</p>,
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
          <p className="text-sm text-white m-0">
            Hello,
            <span className="font-semibold  ml-1 m-0 ">Guest</span>
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
    <header className="h-20 flex items-center justify-between px-10 gap-10">
      <div className="flex justify-start items-center gap-2">
        <Link to="/">
          <Avatar
            className="bg-amber-700!"
            size={40}
            icon={<AiOutlineAmazon />}
          />
        </Link>
        <h3 className="text-sm font-semibold font-raleway ">Amazon</h3>
      </div>
      <Input
        placeholder="Search products..."
        searchIcon={<TfiSearch />}
        className="w-64!"
      />

      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative">
          <Button icon={<TfiShoppingCart className="size-4" />}></Button>
        </Link>

        <Dropdown
          menu={{
            items: user ? loggedInItems : guestItems,
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" icon={<FaRegUser className="size-3" />} />
        </Dropdown>
      </div>
    </header>
  );
}

export default NavBar;
