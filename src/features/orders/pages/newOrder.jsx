import { Button, Card, Form, Typography, notification } from "antd";
import { CreditCardOutlined, TruckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ShippingAddressForm from "../components/shippingAddressForm";
import { useCreateCODOrder } from "../hooks/useCreateOrder";
import { useCreateStripeCheckout } from "../hooks/useCreateStripeCheckout";
import { useQueryClient } from "@tanstack/react-query";
import {
  clearCheckoutAttempt,
  getCheckoutConflict,
  getCheckoutAttempt,
  isCheckoutReplay,
} from "../../../shared/utils/checkoutHelper";

const { Title, Text } = Typography;

const NewOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: createCOD, isPending: isCODPending } = useCreateCODOrder();

  const { mutate: createStripe, isPending: isStripePending } =
    useCreateStripeCheckout();

  const handleCheckoutReplay = (response) => {
    clearCheckoutAttempt();
    notification.info({
      message: "Checkout already exists",
      description:
        response?.message ||
        response?.data?.message ||
        "This checkout was already created. Redirecting to My Orders.",
      pauseOnHover: true,
      showProgress: true,
      placement: "bottomRight",
    });
    navigate("/orders/myorders");
  };

  const handleCheckoutError = (error) => {
    const conflict = getCheckoutConflict(error);

    if (conflict === "IDEMPOTENCY_IN_PROGRESS") {
      notification.warning({
        message: "Checkout is still processing",
        description: "Please wait and try again in a moment.",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
      return true;
    }

    if (conflict) {
      clearCheckoutAttempt();
      notification.error({
        message: "Checkout conflict",
        description:
          error.response?.data?.message ||
          "The cart or shipping address changed for this checkout.",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
      navigate("/orders/myorders");
      return true;
    }

    return false;
  };

  const handleCOD = async () => {
    try {
      const shippingAddress = await form.validateFields();
      const attempt = getCheckoutAttempt();
      createCOD(
        { shippingAddress, idempotencyKey: attempt.key },
        {
          onSuccess: (response) => {
            if (isCheckoutReplay(response)) {
              handleCheckoutReplay(response);
              return;
            }

            clearCheckoutAttempt();
            notification.success({
              message: "Order placed successfully",
              description: "Your Cash on Delivery order has been created.",
              pauseOnHover: true,
              showProgress: true,
              placement: "bottomRight",
            });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            navigate("/orders/myorders");
          },
          onError: (error) => {
            if (handleCheckoutError(error)) return;

            notification.error({
              message: "Unable to place order",
              description: error.response?.data?.message || "Please try again.",
              pauseOnHover: true,
              showProgress: true,
              placement: "bottomRight",
            });
          },
        },
      );
    } catch (error) {
      if (error.errorFields) return;

      notification.error({
        message: "Something went wrong",
        description: "Please try again.",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    }
  };

  const handleStripe = async () => {
    try {
      const shippingAddress = await form.validateFields();
      const attempt = getCheckoutAttempt();

      createStripe(
        { shippingAddress, idempotencyKey: attempt.key },
        {
          onSuccess: (response) => {
            if (isCheckoutReplay(response)) {
              handleCheckoutReplay(response);
              return;
            }

            const checkoutUrl = response.data.checkoutUrl;

            if (!checkoutUrl) {
              clearCheckoutAttempt();
              notification.error({
                message: "Unable to start payment",
                description: "Stripe Checkout URL was not returned.",
                pauseOnHover: true,
                showProgress: true,
                placement: "bottomRight",
              });
              return;
            }

            window.location.assign(checkoutUrl);
          },
          onError: (error) => {
            if (handleCheckoutError(error)) return;

            notification.error({
              message: "Unable to start payment",
              description: error.response?.data?.message || "Please try again.",
              pauseOnHover: true,
              showProgress: true,
              placement: "bottomRight",
            });
          },
        },
      );
    } catch (error) {
      if (error.errorFields) return;

      notification.error({
        message: "Something went wrong",
        description: "Please try again.",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    }
  };

  const isSubmitting = isCODPending || isStripePending;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <Title level={2} className="mb-1!">
          Checkout
        </Title>
        <Text type="secondary">
          Provide your delivery details and choose how you want to pay.
        </Text>
      </header>

      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start">
        <Card
          className="min-w-0 w-full rounded-xl shadow-sm lg:flex-1"
          title={
            <div className="py-1">
              <Title level={4} className="mb-1!">
                Shipping address
              </Title>
              <Text type="secondary" className="font-normal">
                Where should we deliver your order?
              </Text>
            </div>
          }
        >
          <ShippingAddressForm form={form} />
        </Card>

        <Card
          className="w-full rounded-xl shadow-sm lg:w-80 lg:shrink-0"
          title={
            <div className="py-1">
              <Title level={4} className="mb-1!">
                Payment method
              </Title>
              <Text type="secondary" className="font-normal">
                Choose your preferred payment option.
              </Text>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <Button
              type="primary"
              size="large"
              block
              icon={<TruckOutlined />}
              onClick={handleCOD}
              loading={isCODPending}
              disabled={isSubmitting}
              className="h-12!"
            >
              Cash on Delivery
            </Button>

            <Button
              size="large"
              block
              icon={<CreditCardOutlined />}
              onClick={handleStripe}
              loading={isStripePending}
              disabled={isSubmitting}
              className="h-12!"
            >
              Pay with Stripe
            </Button>

            <Text type="secondary" className="mt-1 text-xs">
              You will be redirected to Stripe to complete your payment.
            </Text>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default NewOrder;
