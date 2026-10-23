import { Segmented } from "antd";
import { useState } from "react";
import { MdVerified, MdPersonOutline, MdStorefront } from "react-icons/md";
import BuyerRegister from "../components/buyerRegister";
import SellerRegister from "../components/sellerRegister";
import CustomTag from "../../../shared/components/customTag";
import { IoHome, IoShieldCheckmarkSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const USER_TYPES = [
  {
    value: "Buyer",
    desc: "Discover authentic studio craft and find your favorites",
    icon: <MdPersonOutline />,
  },
  {
    value: "Seller",
    desc: "Showcase your products and grow your business",
    icon: <MdStorefront />,
  },
];

function Register() {
  const [userType, setUserType] = useState("Buyer");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-purple-50">
      <Link
        to={"/"}
        className="fixed top-4 left-0 z-50 flex items-center gap-2 rounded-r-lg! bg-blue-600! p-2 text-white! shadow-lg! transition-colors! hover:bg-blue-700! sm:top-20 sm:-translate-y-1/2 sm:p-3"
      >
        <IoHome size={20} />
      </Link>
      <div className="flex min-h-screen flex-col items-center justify-center px-3 py-6 pb-10 font-sans sm:px-4 sm:py-4">
        <CustomTag
          className="mb-2! rounded-2xl!"
          color="#EAEDFF"
          text="Aura Identity Gateway"
          icon={<MdVerified />}
        />

        <h2 className="mb-2 text-2xl font-semibold">
          Create your Aura Account
        </h2>

        <p className="theme-muted mb-3 max-w-72 text-center text-xs">
          Join as a Collector or apply as an Artisan Workshop to buy and sell
          authentic studio craft.
        </p>

        <div className="relative isolate w-full min-w-0 max-w-xl">
          <div className="absolute -bottom-10 -right-20 z-0 h-40 w-40 rounded-full bg-indigo-500/60 blur-2xl" />

          <div className="theme-panel relative z-10 w-full min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4">
            <p className="mb-2 text-[11px] font-medium tracking-wider text-slate-600">
              SELECT ACCOUNT TYPE
            </p>
            <Segmented
              block
              value={userType}
              onChange={setUserType}
              className="mb-4! w-full! min-w-0! rounded-2xl! bg-[#e9ebff]! p-1.5!
              font-sans
                [&_.ant-segmented-item]:rounded-xl!
                [&_.ant-segmented-thumb]:rounded-xl!   
                [&_.ant-segmented-item-label]:p-0!
            
               "
              options={USER_TYPES.map((t) => {
                const active = userType === t.value;
                return {
                  value: t.value,
                  label: (
                    <div className="px-2 py-2 text-left sm:px-3.5">
                      <div
                        className={`flex items-center gap-2 ${
                          active ? "text-indigo-600" : "text-slate-800"
                        }`}
                      >
                        <span className="text-sm">{t.icon}</span>
                        <span className=" text-sm font-semibold">
                          {t.value}
                        </span>
                        {active && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-indigo-50" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[10px] leading-snug whitespace-normal text-slate-600">
                        {t.desc}
                      </p>
                    </div>
                  ),
                };
              })}
            />
            <div className="flex justify-center items-center mt-4 mb-2">
              <CustomTag
                text={
                  "Enjoy exclusive buyer protection, product authenticity, and premiumcollection access"
                }
                color={"#EAEDFF"}
                className={
                  "max-w-full whitespace-normal! break-words py-2! px-3! text-center leading-snug rounded-xl!"
                }
                icon={<IoShieldCheckmarkSharp />}
              ></CustomTag>
            </div>
            {userType === "Buyer" ? <BuyerRegister /> : <SellerRegister />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
