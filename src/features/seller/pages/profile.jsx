import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Result,
  Tag,
  message,
} from "antd";
import {
  UserOutlined,
  ShopOutlined,
  AppstoreOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";

import { initials } from "../../../shared/utils/initialsName";
import { useGetSellerProfile } from "../hooks/useSellerprofile";

const STORE_OPTIONS = [
  "Clothing",
  "Electronics",
  "Beauty",
  "Furniture",
  "Sports",
  "Toys",
  "Food",
].map((type) => ({
  value: type,
  label: type,
}));

function SellerProfile() {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [passwordModal, setPasswordModal] = useState(false);

  const { data: profile, isLoading, isError, refetch } = useGetSellerProfile();

  // Populate form when API data arrives
  useEffect(() => {
    if (!profile) return;

    profileForm.setFieldsValue({
      name: profile.name || "",
      storeName: profile.sellerProfile?.storeName || "",
      storeType: profile.sellerProfile?.storeType || "",
    });
  }, [profile, profileForm]);

  const handlePasswordChange = () => {
    message.info("Password API is not connected yet.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-4 sm:p-6">
        <div className="mb-5">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[2.2fr_1fr]">
          <Skeleton active paragraph={{ rows: 7 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-4 sm:p-6">
        <Result
          status="error"
          title="Unable to load seller profile"
          extra={
            <Button
              type="primary"
              onClick={() => refetch()}
              className="profile-primary-button"
            >
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  const storeName = profile.sellerProfile?.storeName || "";
  const storeType = profile.sellerProfile?.storeType || "";

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] p-4 text-[var(--text)] sm:p-6">
      {/* Profile Header */}
      <section className="theme-panel my-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-base font-semibold text-blue-500">
            {initials(profile.name || "")}
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-h)]">
              {profile.name}
            </h2>

            <p className="mt-1 text-xs text-[var(--text)]">{profile.email}</p>

            <p className="mt-1 text-xs text-[var(--text)]">
              Store:{" "}
              <span className="font-medium text-blue-500">
                {storeName || "N/A"}
              </span>
            </p>

            <p className="mt-1 text-xs text-[var(--text)]">
              Member Since:{" "}
              <span className="font-medium text-[var(--text-h)]">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Tag className="profile-blue-tag capitalize">{profile.role}</Tag>

              {storeType && <Tag className="profile-blue-tag">{storeType}</Tag>}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[2.2fr_1fr]">
          {/* Seller Details */}
          <Card className="profile-card" styles={{ body: { padding: 24 } }}>
            <div className="mb-6">
              <h2 className="mb-1 text-base font-bold text-[var(--text-h)]">
                Seller Details
              </h2>

              <p className="text-xs text-[var(--text)]">
                Your personal details and store information
              </p>
            </div>

            <Form
              form={profileForm}
              layout="vertical"
              className="[&_.ant-form-item-label>label]:!text-[var(--text-h)]"
            >
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                {/* Seller Name */}
                <Form.Item label="Seller Name" name="name">
                  <Input
                    prefix={<UserOutlined className="text-[var(--text)]" />}
                    readOnly
                    className="profile-field h-10"
                  />
                </Form.Item>

                {/* Store Name */}
                <Form.Item label="Store Name" name="storeName">
                  <Input
                    prefix={<ShopOutlined className="text-[var(--text)]" />}
                    readOnly
                    className="profile-field h-10"
                  />
                </Form.Item>

                {/* Store Type */}
                <Form.Item label="Store Type" name="storeType">
                  <Select
                    disabled
                    options={STORE_OPTIONS}
                    suffixIcon={<AppstoreOutlined />}
                    className="w-full [&_.ant-select-selector]:!border-[var(--border)] [&_.ant-select-selector]:!bg-[var(--workspace-surface)] [&_.ant-select-selection-item]:!text-[var(--text-h)]"
                  />
                </Form.Item>
              </div>
            </Form>
          </Card>

          {/* Password Section */}
          <Card
            className="profile-card h-fit"
            styles={{ body: { padding: 24 } }}
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
              <KeyOutlined className="text-lg text-blue-500" />
            </div>

            <h3 className="mb-2 text-sm font-bold text-[var(--text-h)]">
              Password & Credentials
            </h3>

            <p className="mb-4 text-xs text-[var(--text)]">
              Manage your account password and security.
            </p>

            <Button
              type="primary"
              block
              icon={<LockOutlined />}
              onClick={() => setPasswordModal(true)}
              className="profile-primary-button h-10 rounded-full"
            >
              Change Account Password
            </Button>
          </Card>
        </div>

        {/* Password Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-[var(--text-h)]">
              <KeyOutlined className="text-blue-500" />
              <span>Change Account Password</span>
            </div>
          }
          className="[&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-[var(--border)] [&_.ant-modal-content]:!bg-[var(--code-bg)] [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-title]:!text-[var(--text-h)] [&_.ant-modal-close]:!text-[var(--text)]"
          open={passwordModal}
          onCancel={() => {
            setPasswordModal(false);
            passwordForm.resetFields();
          }}
          footer={null}
          centered
          destroyOnHidden
        >
          <p className="mb-5 text-sm text-[var(--text)]">
            Update your password to keep your account secure.
          </p>

          <Form
            form={passwordForm}
            layout="vertical"
            className="[&_.ant-form-item-label>label]:!text-[var(--text-h)]"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Enter your current password",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-[var(--text)]" />}
                placeholder="Enter current password"
                size="large"
                className="profile-field"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Enter your new password",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-[var(--text)]" />}
                placeholder="Enter new password"
                size="large"
                className="profile-field"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value === getFieldValue("newPassword")) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-[var(--text)]" />}
                placeholder="Confirm new password"
                size="large"
                className="profile-field"
              />
            </Form.Item>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setPasswordModal(false);
                  passwordForm.resetFields();
                }}
                className="theme-outline-button rounded-full px-5"
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                className="profile-primary-button rounded-full px-5"
              >
                Update Password
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default SellerProfile;
