import { Button, Form, Input, Modal } from "antd";
import { KeyOutlined, LockOutlined } from "@ant-design/icons";

import {
  sellerPasswordSchema,
  yupFieldRule,
} from "../validations/profile.validation";

function ChangePasswordModal({ open, isSaving, onClose, onSubmit }) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleFinish = (values) => {
    onSubmit(values, () => {
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-[var(--text-h)]">
          <KeyOutlined className="text-blue-500" />
          <span>Change Account Password</span>
        </div>
      }
      className="[&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-[var(--border)] [&_.ant-modal-content]:!bg-[var(--code-bg)] [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-title]:!text-[var(--text-h)] [&_.ant-modal-close]:!text-[var(--text)]"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      destroyOnHidden
    >
      <p className="mb-5 text-sm text-[var(--text)]">
        Enter your new password and confirm it below.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="[&_.ant-form-item-label>label]:!text-[var(--text-h)]"
      >
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[yupFieldRule(sellerPasswordSchema, "newPassword")]}
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
            yupFieldRule(sellerPasswordSchema, "confirmPassword", (value) => ({
              newPassword: form.getFieldValue("newPassword"),
              confirmPassword: value,
            })),
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
            onClick={handleCancel}
            className="theme-outline-button rounded-full px-5"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={isSaving}
            className="profile-primary-button rounded-full px-5"
          >
            Update Password
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default ChangePasswordModal;
