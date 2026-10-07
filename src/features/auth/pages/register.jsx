import { Segmented } from "antd";
import { useState } from "react";
import BuyerRegister from "../components/buyerRegister";
import SellerRegister from "../components/sellerRegister";

function Register() {
  let [userType, setUserType] = useState("Buyer");
  return (
    <div className="theme-page min-h-screen">
      <div className="flex justify-center min-h-screen items-center  font-sans flex-col">
        <div className="theme-panel min-w-74 sm:min-w-96 overflow-auto p-4 rounded-2xl">
          <h2 className="theme-heading text-sm font-bold">Create an account</h2>
          <p className="theme-muted text-xs mt-2 mb-6">
            Enter your information below to create your account
          </p>

          <div className="flex justify-center items-center">
            <Segmented
              value={userType}
              onChange={setUserType}
              style={{ marginBottom: 8 }}
              options={["Buyer", "Seller"]}
            />
          </div>

          {userType == "Buyer" ? <BuyerRegister /> : <SellerRegister />}
        </div>
      </div>
    </div>
  );
}

export default Register;
