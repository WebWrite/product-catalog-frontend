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
import { useDispatch, useSelector } from "react-redux";
import {
  useCartQuery,
  useDeleteCart,
  useDeleteItem,
  useEditItem,
  useGuestCartProducts,
} from "../hooks/useCart";
import Loader from "../../../shared/components/loader";
import { Button, Empty, notification, Popconfirm } from "antd";
import {
  clearCart,
  removeItem,
  updateItem,
} from "../../../app/store/cart/cart";
import { updateCart } from "../../../app/store/user/userSlice";

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
  let dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => !!state.user?.email);
  const guestItems = useSelector((state) => state.cart.items);
  const editItem = useEditItem();
  const deleteItem = useDeleteItem();
  const deleteCart = useDeleteCart();

  const { data, isLoading, isError } = useCartQuery();
  const {
    data: guestProducts = [],
    isLoading: areGuestProductsLoading,
    isError: areGuestProductsError,
  } = useGuestCartProducts();

  if (isLoggedIn && isLoading) return <Loader />;
  if (!isLoggedIn && areGuestProductsLoading) return <Loader />;

  if (isLoggedIn && isError)
    notification.error({
      description: `Something went wrong`,
      pauseOnHover: true,
      showProgress: true,
      placement: "bottomRight",
    });

  if (!isLoggedIn && areGuestProductsError)
    notification.error({
      description: "Unable to load cart products",
      pauseOnHover: true,
      showProgress: true,
      placement: "bottomRight",
    });

  const guestProductsById = new Map(
    guestProducts.map((product) => [product?._id, product]),
  );

  const items = isLoggedIn
    ? (data?.cart?.items ?? []).map((i) => ({
        id: i._id,
        productId: i.productId?._id,
        name: i.productId?.name,
        unitPrice: i.productId?.price ?? 0,
        sellerName: i.productId?.sellerId?.name ?? "Unknown Seller",
        size: i.size,
        quantity: i.quantity,
        inStock: (i.productId?.stock ?? 0) > 0,
        image: i.productId?.image?.url,
      }))
    : guestItems.flatMap((i) => {
        const product = guestProductsById.get(i.productId);
        console.log(guestProducts);

        if (!product) return [];

        return [
          {
            id: `${i.productId}-${i.size}`,
            productId: i.productId,
            name: product.name,
            unitPrice: product.price ?? 0,
            sellerName:
              product.seller?.storeName ||
              product.sellerId?.name ||
              "Unknown Seller",
            size: i.size,
            quantity: i.quantity,
            inStock: (product.stock ?? 0) > 0,
            image: product.image?.url,
          },
        ];
      });

  const unitCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const handleEditItem = (itemId, quantity) => {
    const item = items.find((cartItem) => cartItem.id === itemId);

    if (!item) return;

    if (isLoggedIn) {
      editItem.mutate({ item: item.id, quantity });
      dispatch(updateCart(quantity));
    } else {
      dispatch(
        updateItem({ productId: item.productId, size: item.size, quantity }),
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    const item = items.find((cartItem) => cartItem.id === itemId);

    if (!item) return;

    if (isLoggedIn) {
      deleteItem.mutate({ item: item.id });
    } else {
      dispatch(removeItem({ productId: item.productId, size: item.size }));
    }
  };

  const handleDeleteAll = () => {
    if (isLoggedIn) deleteCart.mutate();
    else dispatch(clearCart());
  };

  return (
    <div className="font-sans min-h-screen p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-2 mb-4 mt-2 sm:mt-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl text-black font-semibold">
              Shopping Bag
            </h2>
            <CustomTag
              text={`${unitCount} ${unitCount === 1 ? "item" : "items"}`}
              color={"#EAEDFF"}
              className={"rounded-xl!"}
            />
          </div>
          <p className="theme-muted text-sm sm:text-base">
            Curated goods directly sourced from verified independent workshops
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <CustomTag
            text={"Verified Seller"}
            icon={<BsPatchCheck />}
            color="#EAEDFF"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-5">
        <section className="space-y-4 w-full min-w-0 lg:flex-1">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-4">
              <Empty className="my-8" />
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                id={item.id}
                image={item.image}
                key={item.id}
                quantity={item.quantity}
                sellerName={item.sellerName}
                inStock={item.inStock}
                unitPrice={item.unitPrice}
                variant={item.size || "Default"}
                note={"Made in Small Batches"}
                name={item.name}
                onQuantityChange={handleEditItem}
                onRemove={handleRemoveItem}
              />
            ))
          )}

          <div className="bg-white rounded-xl p-3 sm:p-4 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CustomButton
              className={
                "text-sm! font-semibold! gap-2! text-indigo-800! hover:text-indigo-900! "
              }
              text={"Continue Shopping"}
              icon={<FaArrowLeftLong />}
              type={"link"}
            />

            <Popconfirm
              title="Clear all cart"
              description="Are you sure to clear all cart ?"
              onConfirm={handleDeleteAll}
              okText="Yes"
              cancelText="No"
            >
              <Button
                className={
                  " text-gray-600! hover:text-gray-700! text-xs! font-medium! gap-2! "
                }
                icon={<AiOutlineShoppingCart />}
                type={"link"}
              >
                Clear All Items
              </Button>
            </Popconfirm>
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 sm:p-5 w-full lg:w-96 xl:w-md lg:shrink-0 self-start lg:sticky lg:top-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl text-black font-semibold">
              Order Summary
            </h2>
            <CustomTag
              text={`${unitCount} ${unitCount === 1 ? "unit" : "units"}`}
              color={"#EAEDFF"}
              className={"rounded-2xl!"}
            />
          </div>

          <div className="flex justify-between items-center gap-2 text-xs mt-6 sm:mt-8">
            <h6 className="theme-muted">Items SubTotal</h6>
            <p className="text-black">{money(subtotal)}</p>
          </div>

          <div className="flex justify-between items-center gap-2 text-xs mt-3">
            <h6 className="theme-muted">Shipping</h6>
            <p className="text-xs">
              <span className="line-through">{money(20)}</span>
              <span className="uppercase text-indigo-800 font-semibold ml-2">
                Free
              </span>
            </p>
          </div>

          <div className="flex justify-between items-center gap-2 text-xs mt-3">
            <h6 className="theme-muted">Tax & Customs duties</h6>
            <p className="text-black text-right">Calculated at checkout</p>
          </div>

          <hr className="mt-5 text-gray-300" />

          <div className="flex justify-between items-center gap-2 mb-4 mt-3">
            <h6 className="text-black text-lg sm:text-xl font-bold">Total</h6>
            <p className="text-2xl sm:text-3xl font-semibold text-indigo-800">
              {money(subtotal)}
            </p>
          </div>

          <CustomButton
            className="w-full! py-5! text-xs! sm:text-sm! bg-indigo-700! text-white! rounded-lg! hover:bg-indigo-800!"
            variant="solid"
            icon={<CiLock className="size-4" />}
            text={`Proceed to checkout - ${money(subtotal)}`}
          />

          <div className="mt-5 flex flex-col gap-3">
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
  );
}

export default CartPage;
