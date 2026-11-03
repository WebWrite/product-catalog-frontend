import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { App, Button, Form, Input, Modal, Result, Select, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdArrowBack, MdLockReset, MdOutlineStorefront } from "react-icons/md";
import { getAdminSellerById, updateAdminSeller } from "../api/api";
import { PASSWORD_CHECKS } from "../../../shared/utils/constant";

const STORE_TYPES = [
  "Clothing",
  "Electronics",
  "Beauty",
  "Furniture",
  "Sports",
  "Toys",
  "Food",
];
const SELLER_STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const sellerQuery = useQuery({
    queryKey: ["admin", "seller", id],
    queryFn: () => getAdminSellerById(id),
    enabled: !!id,
  });
  const updateMutation = useMutation({
    mutationFn: (values) => updateAdminSeller(id, values),
    onSuccess: (seller) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "seller", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      form.setFieldsValue({
        name: seller.userId?.name,
        storeName: seller.storeName,
        storeType: seller.storeType,
        status: seller.userId?.status,
      });
      notification.success({
        title: "Seller updated",
        description: "Seller details were saved successfully.",
        placement: "bottomRight",
      });
    },
    onError: () => {
      notification.error({
        title: "Update failed",
        description: "Unable to save seller details.",
        placement: "bottomRight",
      });
    },
  });
  const passwordMutation = useMutation({
    mutationFn: (password) => updateAdminSeller(id, { password }),
    onSuccess: () => {
      setPasswordOpen(false);
      passwordForm.resetFields();
      notification.success({
        title: "Password updated",
        description: "Seller password was changed successfully.",
        placement: "bottomRight",
      });
    },
    onError: () => {
      notification.error({
        title: "Password update failed",
        description: "Unable to change the seller password.",
        placement: "bottomRight",
      });
    },
  });

  const handleSavePassword = async () => {
    const values = await passwordForm.validateFields();
    passwordMutation.mutate(values.password);
  };

  if (sellerQuery.isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading seller...</div>;
  }

  const seller = sellerQuery.data;
  if (sellerQuery.isError || !seller) {
    return (
      <Result
        status="404"
        title="Seller not found"
        extra={
          <Link to="/admin/sellers">
            <Button type="primary">Back to sellers</Button>
          </Link>
        }
      />
    );
  }

  const owner = seller.userId ?? {};
  const status = owner.status ?? "active";

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-8 ">
      <Link
        to="/admin/sellers"
        className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600"
      >
        <MdArrowBack /> Back to Seller Management
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-xl text-indigo-700">
          <MdOutlineStorefront />
        </span>
        <div>
          <h1 className="m-0 text-2xl font-bold text-slate-900">
            {seller.storeName}
          </h1>
          <p className="m-0 text-[11px] text-slate-500">{seller.storeType}</p>
        </div>
        <Tag color={status === "active" ? "green" : "orange"}>{status}</Tag>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <h2 className="m-0 text-base font-bold text-slate-900">
            Edit Seller Details
          </h2>

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            className="mt-5"
            initialValues={{
              name: seller.userId?.name,
              storeName: seller.storeName,
              storeType: seller.storeType,
              status,
            }}
            onFinish={(values) =>
              updateMutation.mutate({ ...values, name: values.name.trim() })
            }
          >
            <Form.Item
              label="Owner Name"
              name="name"
              rules={[
                { required: true, message: "Owner name is required" },
                { min: 2, message: "At least 2 characters" },
                { max: 100, message: "Name must be less than 100 characters" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Store Name"
              name="storeName"
              rules={[
                { required: true, message: "Store name is required" },
                { min: 3, message: "At least 3 characters" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Store Type"
              name="storeType"
              rules={[{ required: true, message: "Store type is required" }]}
            >
              <Select
                options={STORE_TYPES.map((type) => ({
                  value: type,
                  label: type,
                }))}
              />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select options={SELLER_STATUSES} />
            </Form.Item>

            <div className="flex flex-wrap justify-end gap-3">
              <Button onClick={() => navigate("/admin/sellers")}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateMutation.isPending}
                className="bg-indigo-700!"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </section>

        <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="m-0 text-sm font-bold text-slate-900">
            Seller Account
          </h3>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <p className="m-0">
              <b className="text-slate-900">Name:</b> {owner.name ?? "-"}
            </p>
            <p className="m-0">
              <b className="text-slate-900">Email:</b> {owner.email ?? "-"}
            </p>
            <p className="m-0">
              <b className="text-slate-900">Role:</b> {owner.role ?? "-"}
            </p>
            <p className="m-0">
              <b className="text-slate-900">Verified:</b>{" "}
              {owner.isVerified ? "Yes" : "No"}
            </p>
          </div>
          <Button
            icon={<MdLockReset />}
            onClick={() => setPasswordOpen(true)}
            className="mt-4 w-full bg-indigo-50! text-indigo-700!"
          >
            Change Password
          </Button>
        </aside>
      </div>

      <Modal
        title="Change seller password"
        open={passwordOpen}
        okText="Save Password"
        confirmLoading={passwordMutation.isPending}
        onOk={handleSavePassword}
        onCancel={() => {
          setPasswordOpen(false);
          passwordForm.resetFields();
        }}
      >
        <Form layout="vertical" form={passwordForm}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { max: 128, message: "Password must be less than 128 character" },
              {
                validator: (_, value) =>
                  !value || PASSWORD_CHECKS.every((check) => check.test(value))
                    ? Promise.resolve()
                    : Promise.reject(new Error("Password is too weak")),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm Password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || value === getFieldValue("password")
                    ? Promise.resolve()
                    : Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SellerDetail;
