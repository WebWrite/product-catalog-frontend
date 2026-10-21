import { Form, Input } from "antd";
import * as yup from "yup";

const shippingAddressSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Enter your full name.")
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .matches(
      /^[\p{L}\s.'-]+$/u,
      "Name can only contain letters, spaces, and . ' -",
    ),

  phone: yup
    .string()
    .required("Enter your phone number.")
    .matches(/^[0-9]{10}$/, "Enter 10 digits after +92."),

  address: yup
    .string()
    .trim()
    .required("Enter your address.")
    .min(5, "Address must be at least 5 characters.")
    .max(500, "Address cannot exceed 500 characters."),

  city: yup
    .string()
    .trim()
    .required("Enter your city.")
    .min(2, "City must be at least 2 characters.")
    .max(100, "City cannot exceed 100 characters.")
    .matches(/^[\p{L}\s.'-]+$/u, "Enter a valid city name."),

  postalCode: yup
    .string()
    .required("Enter your postal code.")
    .matches(/^[0-9]+$/, "Postal code must contain digits only.")
    .min(2, "Postal code must be at least 2 digits.")
    .max(20, "Postal code cannot exceed 20 digits."),
});

const yupRule = (field) => ({
  validator: async (_, value) => {
    await shippingAddressSchema.validateAt(field, {
      [field]: value,
    });
  },
});

const ShippingAddressForm = ({ form }) => (
  <Form
    form={form}
    layout="vertical"
    requiredMark={false}
    className="shipping-address-form"
  >
    <Form.Item
      name="fullName"
      label="Full name"
      rules={[yupRule("fullName")]}
    >
      <Input
        size="large"
        placeholder="Ahmed Khan"
        autoComplete="name"
        maxLength={100}
      />
    </Form.Item>

    <Form.Item
      name="phone"
      label="Phone number"
      extra="Enter your 10-digit mobile number."
      rules={[yupRule("phone")]}
    >
      <Input
        size="large"
        addonBefore="+92"
        placeholder="3001234567"
        autoComplete="tel-national"
        maxLength={10}
        inputMode="numeric"
      />
    </Form.Item>

    <Form.Item
      name="address"
      label="Street address"
      rules={[yupRule("address")]}
    >
      <Input.TextArea
        placeholder="House number, street, area"
        autoComplete="street-address"
        autoSize={{ minRows: 3, maxRows: 5 }}
        maxLength={500}
        showCount
      />
    </Form.Item>

    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <Form.Item
        name="city"
        label="City"
        rules={[yupRule("city")]}
      >
        <Input
          size="large"
          placeholder="Lahore"
          autoComplete="address-level2"
          maxLength={100}
        />
      </Form.Item>

      <Form.Item
        name="postalCode"
        label="Postal code"
        rules={[yupRule("postalCode")]}
      >
        <Input
          size="large"
          placeholder="54782"
          autoComplete="postal-code"
          maxLength={20}
          inputMode="numeric"
        />
      </Form.Item>
    </div>
  </Form>
);

export default ShippingAddressForm;