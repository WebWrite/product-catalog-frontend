import { App, Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuser } from "../../../app/store/user/userSlice";
import { login } from "../../../shared/utils/api";
import { useMutation } from "@tanstack/react-query";

function Login() {
  let dispatch = useDispatch();
  const { notification } = App.useApp();
  let [form] = useForm();

  let handleFinish = async (values) => {
    mutation.mutate(values);
    form.resetFields();
  };

  let mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(setuser(data));

      notification.success({
        title: "Login successfully",
        description: "Welcome back to our platfrom",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
    onError: () => {
      notification.error({
        title: "Login Failed",
        description: "Invalid credentials",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
  });

  return (
    <div className="bg-black min-h-screen">
      <div className="flex justify-center min-h-screen items-center font-sans flex-col">
        <div className="min-w-96 bg-neutral-900   text-white p-4 rounded-2xl">
          <h2 className="text-sm font-bold ">Login to your account</h2>
          <p className="text-xs mt-2 mb-6 text-gray-400">
            Enter email below to login your account
          </p>
          <Form
            form={form}
            layout="vertical"
            className="text-white"
            onFinish={handleFinish}
          >
            <Form.Item
              label="Email"
              name={"email"}
              required={false}
              className="font-semibold text-white "
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input className="font-normal" type={"email"}></Input>
            </Form.Item>

            <Form.Item
              name={"password"}
              label="Password"
              required={false}
              className="font-semibold text-white "
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password className="font-normal"></Input.Password>
            </Form.Item>

            <Form.Item>
              <Button
                disabled={mutation.isPending}
                htmlType="submit"
                type="primary"
                className="bg-white! text-black! text-xs! w-full font-semibold! mt-8   "
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>

            <p className="text-center">
              Don't have any account?{" "}
              <Button className="p-0!" type="link">
                <Link to={"/auth/register"}> Sign up</Link>
              </Button>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
