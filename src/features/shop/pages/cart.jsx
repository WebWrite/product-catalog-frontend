import CartItem from "../../../shared/components/cartCard";
import CustomTag from "../../../shared/components/customTag";
import { BsPatchCheck } from "react-icons/bs";
import { money } from "../../../shared/utils/currency";
import {
  MdOutlineEco,
  MdOutlineKeyboardReturn,
  MdVerifiedUser,
} from "react-icons/md";
import { CiLock } from "react-icons/ci";
import CustomButton from "../../../shared/components/customButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";

function CartPage() {
  const assurance = [
    {
      icon: <MdVerifiedUser />,
      bold: "100% Aura Escrow:",
      text: "Artisan disbursements released only post-delivery inspection.",
    },
    {
      icon: <MdOutlineKeyboardReturn />,
      bold: "30-Day Frictionless Return:",
      text: "Full refunds with pre-printed return dockets.",
    },
    {
      icon: <MdOutlineEco />,
      bold: "Carbon Neutral Transport:",
      text: "High-efficiency insured transit fully offset.",
    },
  ];
  return (
    <div className="font-sans min-h-screen p-4">
      <div>
        <div className="p-2 flex justify-between mb-4 mt-4 items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl   text-black font-semibold">
                Shopping Bag
              </h2>
              <CustomTag
                text={"3 items"}
                color={"#EAEDFF"}
                className={"rounded-xl!"}
              />
            </div>
            <p className="theme-muted">
              Curated goods directly sourced from verified independent workshops
            </p>
          </div>
          <div>
            <CustomTag
              text={"Verified Seller"}
              icon={<BsPatchCheck />}
              color="#EAEDFF"
            />
          </div>
        </div>

        <div className="flex w-full gap-5">
          <section className="space-y-4 w-full ">
            <CartItem
              quantity={2}
              sellerName={"Mohsin"}
              inStock="true"
              unitPrice={56}
              variant={"Raw Sandstone & Espresso"}
              note={"Made in Small Batches"}
              name={"Double-Walled Ceramic Tasting Cups (Set of 2)"}
            />
            <CartItem
              quantity={2}
              sellerName={"Mohsin"}
              inStock="true"
              unitPrice={56}
              variant={"Raw Sandstone & Espresso"}
              note={"Made in Small Batches"}
              name={"Double-Walled Ceramic Tasting Cups (Set of 2)"}
            />

            <div className="bg-white rounded-xl p-4 flex justify-between items-center">
              <CustomButton
                className={
                  "text-sm! font-semibold! gap-2! text-indigo-800! hover:text-indigo-900! "
                }
                text={"Continue Shopping"}
                icon={<FaArrowLeftLong />}
                type={"link"}
              />

              <CustomButton
                className={
                  " text-gray-600! hover:text-gray-700! text-xs! font-medium! gap-2! "
                }
                text={"Clear All Items"}
                icon={<AiOutlineShoppingCart />}
                type={"link"}
              />
            </div>
          </section>

          <section className="rounded-xl bg-white p-4 w-lg self-start">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-black font-semibold">
                Order Summary
              </h2>
              <CustomTag
                text={"4 units"}
                color={"#EAEDFF"}
                className={"rounded-2xl!"}
              />
            </div>
            <div className="flex justify-between items-center text-xs mt-8 ">
              <h6 className="theme-muted">Items SubTotal</h6>
              <p className=" text-black"> {money(329)} </p>
            </div>
            <div className="flex justify-between text-xs items-center mt-3 ">
              <h6 className="theme-muted  ">Shipping</h6>
              <p className="text-xs ">
                <span className="line-through ">{money(20)}</span>
                <span className="uppercase text-indigo-800 font-semibold ml-2 ">
                  Free
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center text-xs mt-3 ">
              <h6 className="theme-muted">Tax & Customs duties</h6>
              <p className=" text-black">Calculated at checkout </p>
            </div>

            <hr className="mt-5 text-gray-300" />

            <div className="flex justify-between items-center mb-4  mt-3 ">
              <h6 className="text-black text-xl font-bold">Total</h6>
              <p className=" text-3xl font-semibold text-indigo-800">
                {money(329)}{" "}
              </p>
            </div>

            <CustomButton
              className="w-full! py-5! text-sm! bg-indigo-700! text-white! rounded-lg! hover:bg-indigo-800!"
              variant="solid"
              icon={<CiLock className="size-4 " />}
              text={` Proceed to checkout - ${money(329)}`}
            />

            <div className="m-0 mt-5 flex  flex-col gap-3 p-0">
              {assurance.map((a) => (
                <div
                  key={a.bold}
                  className="flex gap-2.5 text-[11px] leading-snug text-slate-600"
                >
                  <span className="mt-0.5 shrink-0 text-sm text-indigo-700">
                    {a.icon}
                  </span>
                  <p className="m-0">
                    <span className="font-bold text-slate-900">{a.bold}</span>{" "}
                    {a.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
