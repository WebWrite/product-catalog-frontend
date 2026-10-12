import { Segmented } from "antd";
import { useState } from "react";
import { MdVerified, MdPersonOutline, MdStorefront } from "react-icons/md";
import BuyerRegister from "../components/buyerRegister";
import SellerRegister from "../components/sellerRegister";
import CustomTag from "../../../shared/components/customTag";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

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
    <div className="bg-purple-50 min-h-screen ">
      <div className="flex min-h-screen flex-col items-center justify-center font-sans px-4 py-4 pb-10">
        <CustomTag
          className="mb-2! rounded-2xl!"
          color="#EAEDFF"
          text="Aura Identity Gateway"
          icon={<MdVerified />}
        />

        <h2 className="mb-2 text-2xl font-semibold">
          Create your Aura Account
        </h2>

        <p className="theme-muted mb-3 w-72 text-center text-xs">
          Join as a Collector or apply as an Artisan Workshop to buy and sell
          authentic studio craft.
        </p>

        <div className="relative isolate">
          <div className="absolute -bottom-10 -right-20 z-0 h-40 w-40 rounded-full bg-indigo-500/60 blur-2xl" />

          <div className="theme-panel relative z-10 min-w-74 overflow-auto rounded-2xl p-4 sm:min-w-120">
            <p className="mb-2 text-[11px] font-medium tracking-wider text-slate-600">
              SELECT ACCOUNT TYPE
            </p>
            <Segmented
              block
              value={userType}
              onChange={setUserType}
              className="mb-4 bg-[#e9ebff]! p-1.5! rounded-2xl!
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
                    <div className="px-3.5 py-2 text-left">
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
                className={"py-2! px-3! rounded-xl!"}
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
