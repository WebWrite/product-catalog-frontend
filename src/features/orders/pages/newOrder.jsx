import { Button, Card, Form, Typography, notification } from "antd";
import { CreditCardOutlined, TruckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ShippingAddressForm from "../components/shippingAddressForm";
import { useCreateCODOrder } from "../hooks/useCreateOrder";
import { useCreateStripeCheckout } from "../hooks/useCreateStripeCheckout";

const { Title, Text } = Typography;

const NewOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate: createCOD, isPending: isCODPending } = useCreateCODOrder();

  const { mutate: createStripe, isPending: isStripePending } =
    useCreateStripeCheckout();

  const handleCOD = async () => {
    try {
      const shippingAddress = await form.validateFields();

      createCOD(shippingAddress, {
        onSuccess: () => {
          notification.success({
            message: "Order placed successfully",
            description: "Your Cash on Delivery order has been created.",
          });

          navigate("/orders/myorders");
        },
        onError: (error) => {
          notification.error({
            message: "Unable to place order",
            description: error.response?.data?.message || "Please try again.",
          });
        },
      });
    } catch (error) {
      if (error.errorFields) return;

      notification.error({
        message: "Something went wrong",
        description: "Please try again.",
      });
    }
  };

  const handleStripe = async () => {
    try {
      const shippingAddress = await form.validateFields();

      createStripe(shippingAddress, {
        onSuccess: (response) => {
          const checkoutUrl = response.data.checkoutUrl;

          if (!checkoutUrl) {
            notification.error({
              message: "Unable to start payment",
              description: "Stripe Checkout URL was not returned.",
            });
            return;
          }

          window.location.assign(checkoutUrl);
        },
        onError: (error) => {
          notification.error({
            message: "Unable to start payment",
            description: error.response?.data?.message || "Please try again.",
          });
        },
      });
    } catch (error) {
      if (error.errorFields) return;

      notification.error({
        message: "Something went wrong",
        description: "Please try again.",
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
