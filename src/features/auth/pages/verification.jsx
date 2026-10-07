import { Button, Input, Typography } from "antd";
import { useEffect } from "react";
import { TfiReload } from "react-icons/tfi";
import { useLocation, useNavigate } from "react-router-dom";

const { Title } = Typography;

function Verification() {
  let location = useLocation();
  let navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate(-1);
    }
  }, [email, navigate]);

  let onChange = (text) => {
    console.log(text);
  };
  return (
    <div className="theme-page min-h-screen">
      <div className="flex justify-center min-h-screen items-center font-sans flex-col">
        <div className="theme-panel min-w-96 p-4 rounded-2xl">
          <h2 className="theme-heading text-sm font-bold">Verify your login</h2>
          <p className="theme-muted text-xs mt-1.5 mb-2">
            Enter the verification code we sent to your
          </p>
          <p className="theme-muted text-xs mb-6">Email address: {email}</p>

          <div className="flex  justify-between items-center">
            <Title level={5}> Verification Code</Title>
            <Button icon={<TfiReload />}>Resend Code</Button>
          </div>
          <Input.OTP
            className="mt-4"
            size="large"
            onChange={onChange}
          ></Input.OTP>
          <br></br>
          <Button className="w-full mt-4 bg-neutral-200! text-black! font-semibold!">
            Verify
          </Button>

          <p className="theme-muted mt-4 text-center text-xs">
            Having trouble signing in?{" "}
            <Button type="link" className="p-0!">
              Contact support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verification;
