
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  App as AntdApp,
} from "antd";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
} from "../constants/productConstants";
import { productFieldRule } from "../validations/productSchema";

const { TextArea } = Input;

const SIZE_OPTIONS = PRODUCT_SIZES.map((value) => ({
  label: value,
  value,
}));

const CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((value) => ({
  label: value,
  value,
}));

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const normalizeProduct = (values) => ({
  name: values.name?.trim() ?? "",
  category: values.category,
  description: values.description?.trim() ?? "",
  price: Number(values.price),
  stock: Number(values.stock),
  sizes: [...(values.sizes ?? [])].sort(),
  status: values.status ?? "active",
});

function ProductForm({
  mode,
  product,
  onSubmit,
  isPending = false,
}) {
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();

  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!isEdit || !product) return;

    form.setFieldsValue({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sizes: product.sizes ?? [],
      status: product.status ?? "active",
    });

    setImageFile(null);
    setImageError("");
  }, [form, isEdit, product]);

  const beforeUpload = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPG, PNG, and WEBP images are allowed.");
      return Upload.LIST_IGNORE;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be 5 MB or smaller.");
      return Upload.LIST_IGNORE;
    }

    setImageError("");
    setImageFile(file);

    // Upload manually through the API after form submission.
    return false;
  };

  const handleFinish = (values) => {
    if (!isEdit && !imageFile) {
      setImageError("Product image is required.");
      return;
    }

    const payload = {
      ...normalizeProduct(values),
      sizes: values.sizes ?? [],
      ...(imageFile ? { image: imageFile } : {}),
    };

    if (isEdit) {
      const currentValues = normalizeProduct(product);
      const updatedValues = normalizeProduct(payload);

      const hasFieldChanges =
        JSON.stringify(currentValues) !==
        JSON.stringify(updatedValues);

      if (!hasFieldChanges && !imageFile) {
        notification.warning({
          title: "No changes detected",
          description: "Change a field or select a new image.",
          placement: "bottomRight",
        });
        return;
      }
    }

    onSubmit(payload);
  };

  if (isEdit && !product) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full min-w-0 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <MdArrowBack size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-slate-100 m-0 tracking-tight">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>

          <p className="text-slate-400 text-xs md:text-sm mt-0.5 font-medium">
            {isEdit
              ? "Update your product details below."
              : "Fill in the details below to add a product to your catalog."}
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-slate-800 p-4 md:p-6 w-full"
        style={{ background: "#1E293B" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          initialValues={{ status: "active", sizes: [] }}
          className="add-product-form"
        >
          <Form.Item
            label="Product Image"
            required={!isEdit}
            validateStatus={imageError ? "error" : ""}
            help={imageError || ""}
          >
            {isEdit && !imageFile && product.image?.url && (
              <div className="mb-3">
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="w-28 h-28 rounded-lg object-cover border border-slate-700"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Current image
                </p>
              </div>
            )}

            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={beforeUpload}
              onRemove={() => {
                setImageFile(null);
                setImageError("");
                return true;
              }}
              fileList={
                imageFile
                  ? [
                      {
                        uid: imageFile.uid,
                        name: imageFile.name,
                        status: "done",
                        ...(previewUrl ? { url: previewUrl } : {}),
                      },
                    ]
                  : []
              }
              accept="image/jpeg,image/png,image/webp"
              className="product-image-upload"
            >
              {!imageFile && (
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <MdCloudUpload size={22} />
                  <span className="text-[11px] font-medium">Upload</span>
                </div>
              )}
            </Upload>

            <p className="text-[11px] text-slate-500 mt-1 m-0">
              PNG, JPG, or WEBP. Max 5 MB.
              {isEdit && " Leave unchanged to keep the current image."}
            </p>
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="name"
            rules={[productFieldRule("name")]}
            validateTrigger="onBlur"
          >
            <Input
              placeholder="e.g. Tennmoku Carafe"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[productFieldRule("category")]}
          >
            <Select
              placeholder="Select a category"
              options={CATEGORY_OPTIONS}
              popupMatchSelectWidth={false}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[productFieldRule("description")]}
            validateTrigger="onBlur"
          >
            <TextArea
              rows={4}
              placeholder="Describe your product..."
              maxLength={5000}
              showCount
            />
          </Form.Item>

          <div className="flex flex-col md:flex-row gap-4">
            <Form.Item
              label="Price ($)"
              name="price"
              className="flex-1"
              rules={[productFieldRule("price")]}
            >
              <InputNumber
                min={0.01}
                max={1_000_000}
                step={0.01}
                precision={2}
                placeholder="100.00"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Stock"
              name="stock"
              className="flex-1"
              rules={[productFieldRule("stock")]}
            >
              <InputNumber
                min={0}
                max={100_000}
                step={1}
                precision={0}
                placeholder="10"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Sizes (optional)"
            name="sizes"
            rules={[productFieldRule("sizes")]}
          >
            <Select
              mode="multiple"
              placeholder="Select sizes"
              options={SIZE_OPTIONS}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[productFieldRule("status")]}
          >
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button
              size="large"
              onClick={() => navigate("/seller/products")}
              className="bg-slate-800 border-slate-700 text-slate-300 rounded-xl w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl w-full sm:w-auto px-6"
            >
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ProductForm;
