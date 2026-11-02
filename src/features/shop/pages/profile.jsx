import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Form, Input, Modal, Tag, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { initials } from "../../../shared/utils/initialsName";
import api from "../../../shared/utils/api";
import { setuser } from "../../../app/store/user/userSlice";

function CustomerProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [editing, setEditing] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const updateReduxUser = (response) => {
    const updatedUser = response?.user || response?.data?.user || response;

    if (updatedUser && typeof updatedUser === "object") {
      dispatch(
        setuser({
          ...user,
          ...updatedUser,
        }),
      );
    }
  };

  const profileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.patch("/user", data);
      return response.data.user;
    },
    onSuccess: (response) => {
      updateReduxUser(response);
      message.success("Profile updated successfully");
      setEditing(false);
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Unable to update profile",
      );
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.patch("/user", data);
      return response.data.user;
    },
    onSuccess: (response) => {
      updateReduxUser(response);
      message.success("Password changed successfully");
      passwordForm.resetFields();
      setPasswordModal(false);
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Unable to change password",
      );
    },
  });

  const handleEdit = () => {
    profileForm.setFieldsValue({
      name: user?.name || "",
      email: user?.email || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    profileForm.setFieldsValue({
      name: user?.name || "",
      email: user?.email || "",
    });

    profileForm.setFields([]);
    setEditing(false);
  };

  const handleProfileSave = (values) => {
    const updatedData = {};

    const updatedName = values.name?.trim();

    if (updatedName !== user?.name?.trim()) {
      updatedData.name = updatedName;
    }

    if (Object.keys(updatedData).length === 0) {
      message.info("No changes to update");
      setEditing(false);
      return;
    }

    profileMutation.mutate(updatedData);
  };

  const handlePasswordChange = (values) => {
    passwordMutation.mutate({
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f5ff] p-4 sm:p-6">
      <section className="bg-white my-5 rounded-2xl p-4 sm:p-6 font-sans flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-full h-12 w-12 sm:h-13 sm:w-13 text-sm font-semibold bg-gray-300 flex items-center justify-center shrink-0">
            {initials(user?.name || "")}
          </div>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold truncate">
              {user?.name}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Member Since:{" "}
              <span className="font-medium text-indigo-600">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-gray-600">
                Account Role:
              </span>

              <Tag color="purple" className="rounded-full px-3 capitalize">
                {user?.role || "Admin"}
              </Tag>
            </div>
          </div>
        </div>

        <div className="bg-violet-50 rounded-lg p-4 text-center">
          <h4 className="text-sm font-medium">Cart</h4>
          <p className="font-semibold text-2xl sm:text-3xl">
            {user?.cart ?? 0}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-4">
          <Card
            className="rounded-xl border-[#e8e2ff] shadow-sm"
            styles={{ body: { padding: 24 } }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-800 mb-1">
                  Account Credentials & Details
                </h2>
                <p className="text-xs text-gray-400">
                  Verified records tied to your account profile
                </p>
              </div>
            </div>

            <Form
              form={profileForm}
              layout="vertical"
              initialValues={{
                name: user?.name || "",
                email: user?.email || "",
              }}
              onFinish={handleProfileSave}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your name",
                    },
                    {
                      min: 3,
                      max: 50,
                      message: "Name must be between 3 and 50 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    disabled={!editing}
                    className="h-10 bg-[#f3f2ff]"
                  />
                </Form.Item>

                <Form.Item label="Email Address" name="email">
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    disabled
                    className="h-10 bg-[#f3f2ff]"
                  />
                </Form.Item>
              </div>

              <div className="flex justify-end mt-6 gap-2">
                {!editing ? (
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={handleEdit}
                    className="rounded-full bg-[#4936d2] px-6"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      htmlType="button"
                      disabled={profileMutation.isPending}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="primary"
                      htmlType="button"
                      loading={profileMutation.isPending}
                      onClick={() => profileForm.submit()}
                      className="rounded-full bg-[#4936d2] px-6"
                    >
                      Save Profile Preferences
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </Card>

          <Card
            className="rounded-xl border-[#e8e2ff] shadow-sm h-fit"
            styles={{ body: { padding: 24 } }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#e9e7ff] flex items-center justify-center mb-3">
              <KeyOutlined className="text-indigo-600 text-lg" />
            </div>

            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Password & Credentials
            </h3>

            <Button
              type="primary"
              block
              icon={<LockOutlined />}
              onClick={() => setPasswordModal(true)}
              className="rounded-full bg-[#4936d2] h-10"
            >
              Change Account Password
            </Button>
          </Card>
        </div>

        <Modal
          title={
            <div className="flex items-center gap-2">
              <KeyOutlined className="text-indigo-600" />
              <span>Change Account Password</span>
            </div>
          }
          open={passwordModal}
          onCancel={() => {
            if (passwordMutation.isPending) return;
            setPasswordModal(false);
            passwordForm.resetFields();
          }}
          footer={null}
          centered
          closable={!passwordMutation.isPending}
          maskClosable={!passwordMutation.isPending}
          destroyOnHidden
        >
          <p className="text-gray-500 text-sm mb-5">
            Update your password to keep your account secure.
          </p>

          <Form
            form={passwordForm}
            layout="vertical"
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
                prefix={<LockOutlined />}
                placeholder="Enter current password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              dependencies={["currentPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please enter your new password",
                },
                {
                  min: 8,
                  max: 100,
                  message: "Password must be between 8 and 100 characters",
                },
                {
                  pattern: /[A-Z]/,
                  message: "At least one uppercase letter is required",
                },
                {
                  pattern: /[a-z]/,
                  message: "At least one lowercase letter is required",
                },
                {
                  pattern: /[0-9]/,
                  message: "At least one number is required",
                },
                {
                  pattern: /[^A-Za-z0-9]/,
                  message: "At least one special character is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value !== getFieldValue("currentPassword")) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "New password must be different from current password",
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                size="large"
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
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
                size="large"
              />
            </Form.Item>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                htmlType="button"
                disabled={passwordMutation.isPending}
                onClick={() => {
                  setPasswordModal(false);
                  passwordForm.resetFields();
                }}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={passwordMutation.isPending}
                className="bg-[#4936d2]"
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

export default CustomerProfile;
