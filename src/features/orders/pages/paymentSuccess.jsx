import { useQueryClient } from "@tanstack/react-query";
import { Button, Result } from "antd";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-4 sm:p-6">
      <Result
        status="success"
        title="Payment Submitted"
        subTitle={
          sessionId
            ? "Thank you! Your payment is being confirmed."
            : "Payment session information is missing."
        }
        extra={[
          <Button
            key="orders"
            type="primary"
            size="large"
            onClick={() => navigate("/orders/myorders")}
          >
            View My Orders
          </Button>,
          <Button key="shop" size="large" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>,
        ]}
      />
    </main>
  );
};

export default PaymentSuccess;
