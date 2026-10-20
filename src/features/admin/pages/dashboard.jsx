import { IoCartOutline } from "react-icons/io5";
import AnalyticalCard from "../components/analyticalCard";
import { GrCurrency } from "react-icons/gr";
import { BsShop } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import TopSelling from "../components/topSelling";
import RevenueChart from "../components/revenueChart";
import RecentOrder from "../components/recentOrder";
import { money } from "../../../shared/utils/currency";

function AdminDashboard() {
  return (
    <div className="theme-page min-h-screen p-4  ">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <AnalyticalCard
          amount={money(4321)}
          icon={<GrCurrency className="size-5" />}
          title={"Gross Value"}
        />
        <AnalyticalCard
          amount={money(432)}
          icon={<IoCartOutline className="size-5" />}
          title={"Gross Value"}
        />{" "}
        <AnalyticalCard
          amount={money(10210)}
          icon={<BsShop className="size-5" />}
          title={"Total Store"}
        />{" "}
        <AnalyticalCard
          amount={money(21010)}
          icon={<HiOutlineUsers className="size-5" />}
          title={"Registered Account"}
        />
      </div>

      <div className="grid grid-cols-4 mt-10 gap-3 w-full">
        <div className="col-span-3">
          <RevenueChart />
        </div>
        <TopSelling />
      </div>

      <div className="mt-3">
        <RecentOrder />
      </div>
    </div>
  );
}

export default AdminDashboard;
