import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearCheckoutAttempt } from "../../../shared/utils/checkoutHelper";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  useEffect(() => {
    clearCheckoutAttempt();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-4 sm:p-6">
      <Result
        status="warning"
        title="Payment Cancelled"
        subTitle="Your payment was not completed. You can return to checkout and try again."
        extra={[
          <Button
            key="checkout"
            type="primary"
            size="large"
            onClick={() => navigate("/orders/new")}
          >
            Try Again
          </Button>,
          <Button key="shop" size="large" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>,
        ]}
      />
    </main>
  );
};

export default PaymentCancelled;
