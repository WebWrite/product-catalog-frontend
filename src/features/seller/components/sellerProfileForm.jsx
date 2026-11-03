import { useEffect } from "react";
import { Button, Card, Form, Input, Select } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import {
  STORE_OPTIONS,
  sellerProfileSchema,
  yupFieldRule,
} from "../validations/profile.validation";

function SellerProfileForm({ profile, isSaving, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: profile.name || "",
      storeName: profile.sellerProfile?.storeName || "",
      storeType: profile.sellerProfile?.storeType || "",
    });
  }, [profile, form]);

  return (
    <Card className="profile-card" styles={{ body: { padding: 24 } }}>
      <div className="mb-6">
        <h2 className="mb-1 text-base font-bold text-[var(--text-h)]">
          Seller Details
        </h2>

        <p className="text-xs text-[var(--text)]">
          Update your personal details and store information.
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="[&_.ant-form-item-label>label]:!text-[var(--text-h)]"
      >
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Form.Item
            label="Seller Name"
            name="name"
            rules={[yupFieldRule(sellerProfileSchema, "name")]}
          >
            <Input
              prefix={<UserOutlined className="text-[var(--text)]" />}
              placeholder="Enter seller name"
              className="profile-field h-10"
            />
          </Form.Item>

          <Form.Item
            label="Store Name"
            name="storeName"
            rules={[yupFieldRule(sellerProfileSchema, "storeName")]}
          >
            <Input
              prefix={<ShopOutlined className="text-[var(--text)]" />}
              placeholder="Enter store name"
              className="profile-field h-10"
            />
          </Form.Item>

          <Form.Item
            label="Store Type"
            name="storeType"
            rules={[yupFieldRule(sellerProfileSchema, "storeType")]}
          >
            <Select
              options={STORE_OPTIONS}
              placeholder="Select store type"
              suffixIcon={<AppstoreOutlined />}
              className="w-full [&_.ant-select-selector]:!border-[var(--border)] [&_.ant-select-selector]:!bg-[var(--workspace-surface)] [&_.ant-select-selection-item]:!text-[var(--text-h)]"
            />
          </Form.Item>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button
            htmlType="button"
            onClick={() => form.resetFields()}
            className="theme-outline-button rounded-full px-5"
          >
            Reset
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={isSaving}
            className="profile-primary-button rounded-full px-5"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default SellerProfileForm;
