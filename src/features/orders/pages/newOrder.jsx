
import { Button, Card, Form, Typography, notification } from "antd";
import { CreditCardOutlined, TruckOutlined } from "@ant-design/icons";
import ShippingAddressForm from "../components/shippingAddressForm";
import { useCreateCODOrder } from "../hooks/useCreateOrder";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const NewOrder = () => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateCODOrder();
  const navigate = useNavigate()

  const handleCOD = async () => {
    try {
      const shippingAddress = await form.validateFields();

      mutate(shippingAddress, {
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
            description:
              error.response?.data?.message || "Please try again.",
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
              loading={isPending}
              disabled={isPending}
              className="h-12!"
            >
              Cash on Delivery
            </Button>

            <Button
              size="large"
              block
              disabled
              icon={<CreditCardOutlined />}
              className="h-12!"
            >
              Pay with Stripe
            </Button>

            <Text type="secondary" className="mt-1 text-xs">
              Stripe payments will be available soon. Your shipping details
              will be validated before continuing.
            </Text>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default NewOrder;
