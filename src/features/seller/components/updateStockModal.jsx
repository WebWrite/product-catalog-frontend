import { useEffect } from "react";
import { Modal, Form, InputNumber, Button, App as AntdApp } from "antd";
import { useUpdateSellerStock } from "../hooks/useSellerProducts";

function UpdateStockModal({ open, onClose, product }) {
  const { notification } = AntdApp.useApp();
  const [form] = Form.useForm();
  const { mutate: updateStock, isPending } = useUpdateSellerStock();

  useEffect(() => {
    if (open && product) {
      form.setFieldsValue({ stock: product.stock });
    }
  }, [open, product, form]);

  const handleOk = () => {
    if (!product) return;
    form.submit();
  };

  const onFinish = (values) => {
    if (!product) return;

    updateStock(
      { productId: product._id, stock: Number(values.stock) },
      {
        onSuccess: () => {
          notification.success({
            title: "Stock updated",
            description: `"${product.name}" now has ${values.stock} in stock.`,
            placement: "bottomRight",
          });
          form.resetFields();
          onClose();
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to update stock.";
          notification.error({
            title: "Could not update stock",
            description: msg,
            placement: "bottomRight",
          });
        },
      },
    );
  };

 
  if (!product) return null;

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      title={
        <div className="flex flex-col">
          <span className="font-bold text-slate-100">Update Stock</span>
          <span className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
            {product.name}
          </span>
        </div>
      }
      
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            onClose();
          }}
          className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isPending}
          onClick={handleOk}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-lg"
        >
          Save
        </Button>,
      ]}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="mt-4"
      >
        <Form.Item
          label="Stock Quantity"
          name="stock"
          rules={[
            { required: true, message: "Stock is required." },
            { type: "number", min: 0, message: "Stock cannot be negative." },
            { type: "integer", message: "Stock must be a whole number." },
          ]}
        >
          <InputNumber
            min={0}
            step={1}
            precision={0}
            placeholder="0"
            style={{ width: "100%" }}
            autoFocus
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateStockModal;