import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Button, Badge, Dropdown, Input, ConfigProvider, theme } from "antd";
import {
  MdDashboard, MdInventory, MdShoppingCart, MdBarChart,
  MdMessage, MdSettings, MdNotificationsNone, MdAdd,
  MdMenu as MdMenuIcon, MdLogout, MdPerson, MdKeyboardArrowDown,
  MdSearch, MdClose
} from "react-icons/md";
import Footer from "../../../shared/components/footer";

const { Sider, Content } = Layout;

const MENU_ITEMS = [
  { key: "/seller/dashboard", icon: <MdDashboard size={18} />, label: <Link to="/seller/dashboard">Overview</Link> },
  { key: "/seller/products", icon: <MdInventory size={18} />, label: <Link to="/seller/products">Products</Link> },
  { key: "/seller/inventory", icon: <MdInventory size={18} />, label: <Link to="/seller/inventory">Inventory</Link> },
  { key: "/seller/orders", icon: <MdShoppingCart size={18} />, label: <Link to="/seller/orders">Orders</Link> },
  { key: "/seller/analytics", icon: <MdBarChart size={18} />, label: <Link to="/seller/analytics">Analytics</Link> },
  { key: "/seller/messages", icon: <MdMessage size={18} />, label: <Link to="/seller/messages">Messages</Link> },
  { key: "/seller/settings", icon: <MdSettings size={18} />, label: <Link to="/seller/settings">Store Settings</Link> },
];

function SellerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = { name: "Seller", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohsin" };

  const userMenuItems = [
    { key: "profile", label: "Profile", icon: <MdPerson />, onClick: () => navigate("/profile") },
    { type: "divider" },
    { key: "logout", label: "Logout", icon: <MdLogout />, danger: true, onClick: () => console.log("Logout") },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) setCollapsed(true);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#6366F1",
          colorBgContainer: "#1E293B",
          colorBorder: "#334155",
          colorText: "#F1F5F9",
          colorTextSecondary: "#94A3B8",
          fontFamily: "inherit",
          borderRadius: 8,
        },
        components: {
          Layout: { siderBg: "#0F172A", bodyBg: "#0F172A" },
          Menu: {
            darkItemBg: "transparent",
            darkItemSelectedBg: "#4F46E5",
            darkItemSelectedColor: "#FFFFFF",
            darkItemColor: "#94A3B8",
            darkItemHoverBg: "#1E293B",
            darkItemHoverColor: "#F1F5F9",
            itemHeight: 44,
            itemMarginInline: 12,
            itemBorderRadius: 8,
          },
          Table: {
            headerBg: "#1E293B",
            headerColor: "#94A3B8",
            rowHoverBg: "#334155",
            borderColor: "#334155",
            colorBgContainer: "#1E293B",
            colorText: "#F1F5F9",
          },
        },
      }}
    >
      <div className="min-h-screen font-sans flex w-full overflow-x-hidden" style={{ background: '#0F172A' }}>
        
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
          className={`fixed left-0 top-0 bottom-0 z-30 border-r border-slate-800 ${isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300`}
          style={{ position: 'fixed', height: '100vh', overflow: 'auto' }}
        >
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-6'} py-6 mb-2`}>
            <div className="bg-indigo-600 text-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
              <span className="font-bold text-lg">A</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-100 leading-none tracking-tight">Aura</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Marketplace</span>
              </div>
            )}
          </div>

          <Menu mode="inline" selectedKeys={[location.pathname]} items={MENU_ITEMS} theme="dark" onClick={handleMenuClick} />

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
                    <p className="text-xs font-bold m-0 text-slate-100">Studio Kanso</p>
                    <p className="text-[10px] text-slate-500 m-0 font-medium">Kyoto, JP</p>
                 </div>
                 <MdSettings className="text-slate-500 cursor-pointer hover:text-indigo-400" />
              </div>
            </div>
          )}
        </Sider>

        <div 
          className="flex flex-col flex-1 min-h-screen min-w-0"
          style={{ 
            marginLeft: isMobile ? 0 : (collapsed ? 80 : 260), 
            transition: 'all 0.2s',
            background: '#0F172A'
          }}
        >
          <header className="sticky top-0 z-20 w-full border-b border-slate-800" style={{ background: '#0F172A' }}>
            <div className="h-16 px-3 md:px-4 flex items-center justify-between gap-3">
              
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                 <button 
                   onClick={() => setCollapsed(!collapsed)}
                   className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                 >
                   <MdMenuIcon size={20}/>
                 </button>
                 <span className="text-xs text-slate-500 hidden xl:block font-medium whitespace-nowrap">
                   Seller Console / Overview
                 </span>
              </div>

              <div className="hidden lg:flex items-center justify-center flex-1">
                 <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-indigo-500 transition-colors w-64 xl:w-96">
                    <MdSearch className="text-slate-500 mr-2 shrink-0" size={16}/>
                    <Input 
                       variant="borderless"
                       placeholder="Search orders, products, collectors..."
                       className="text-xs text-slate-200 placeholder-slate-500 p-0 flex-1"
                       style={{ color: '#E2E8F0' }}
                    />
                    <span className="text-[10px] text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600 font-medium shrink-0 ml-2">
                      ⌘K
                    </span>
                 </div>
              </div>
              
              <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <MdSearch size={20}/>
                </button>

                <div className="hidden md:flex items-center gap-2 border-r border-slate-800 pr-3 mr-1">
                   <Button icon={<MdAdd />} type="primary" className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs font-semibold rounded-lg shadow-sm px-3">
                     Add Ware
                   </Button>
                </div>
                <Badge dot color="red" offset={[-2, 2]}>
                   <MdNotificationsNone size={22} className="text-slate-400 cursor-pointer hover:text-indigo-400 transition-colors"/>
                </Badge>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                   <div className="flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 px-1.5 py-1 rounded-full border border-slate-700 transition-colors">
                      <Avatar src={user.avatar} size={28} className="bg-indigo-600" />
                      <span className="text-xs font-bold text-slate-200 hidden xl:block pr-1">{user.name}</span>
                      <MdKeyboardArrowDown className="text-slate-500 hidden xl:block" size={16}/>
                   </div>
                </Dropdown>
              </div>
            </div>

            {searchOpen && (
              <div className="lg:hidden px-3 pb-3 border-t border-slate-800 pt-3">
                <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-indigo-500">
                  <MdSearch className="text-slate-500 mr-2 shrink-0" size={16}/>
                  <Input 
                     autoFocus
                     variant="borderless"
                     placeholder="Search orders, products..."
                     className="text-xs text-slate-200 placeholder-slate-500 p-0 flex-1"
                     style={{ color: '#E2E8F0' }}
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-1 ml-2 rounded-md text-slate-500 hover:text-slate-300"
                  >
                    <MdClose size={16}/>
                  </button>
                </div>
              </div>
            )}
          </header>
          
          <Content className="p-3 md:p-4 lg:p-6 flex-1 min-w-0 overflow-x-hidden">
             <Outlet />
          </Content>

          <div className="border-t border-slate-800">
             <Footer />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default SellerLayout;