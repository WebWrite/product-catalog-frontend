import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Form,Input,InputNumber,Select,Button,Upload,App as AntdApp,} from "antd";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { useCreateSellerProduct } from "../hooks/useSellerProducts";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
} from "../constants/productConstants";

const { TextArea } = Input;

const SIZE_OPTIONS = PRODUCT_SIZES.map((s) => ({ label: s, value: s }));
const CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((c) => ({
  label: c,
  value: c,
}));

function AddProduct() {
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();
  const [form] = Form.useForm();
  const { mutate: createProduct, isPending } = useCreateSellerProduct();

  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setImageError("Only image files are allowed.");
      return Upload.LIST_IGNORE;
    }
    const isUnder5MB = file.size / 1024 / 1024 < 5;
    if (!isUnder5MB) {
      setImageError("Image must be smaller than 5MB.");
      return Upload.LIST_IGNORE;
    }
    setImageError("");
    setImageFile(file);
    return false; 
  };

  const onFinish = (values) => {
    if (!imageFile) {
      setImageError("Product image is required.");
      return;
    }

    const payload = {
      category: values.category,
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      sizes: values.sizes ?? [],
      stock: Number(values.stock),
      status: values.status ?? "active",
      image: imageFile,
    };

    createProduct(payload, {
      onSuccess: () => {
        notification.success({
          title: "Product added",
          description: `"${payload.name}" was added to your catalog.`,
          placement: "bottomRight",
        });
        form.resetFields();
        setImageFile(null);
        navigate("/seller/products");
      },
      onError: (err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to add product.";
        notification.error({
          title: "Could not add product",
          description: msg,
          placement: "bottomRight",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full min-w-0 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <MdArrowBack size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-slate-100 m-0 tracking-tight">
            Add New Product
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5 font-medium">
            Fill in the details below to add a new product to your catalog.
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
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{ status: "active", sizes: [] }}
          className="add-product-form"
        >
          <Form.Item
            label="Product Image"
            required
            validateStatus={imageError ? "error" : ""}
            help={imageError || ""}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={beforeUpload}
              onRemove={() => {
                setImageFile(null);
                setImageError("");
              }}
              fileList={
                imageFile
                  ? [
                      {
                        uid: imageFile.uid,
                        name: imageFile.name,
                        status: "done",
                        url: URL.createObjectURL(imageFile),
                      },
                    ]
                  : []
              }
              accept="image/*"
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
              PNG, JPG, or WEBP. Max 5MB.
            </p>
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              { required: true, message: "Product name is required." },
              { min: 2, message: "Product name must be at least 2 characters." },
              { max: 200, message: "Product name cannot exceed 200 characters." },
              {
                validator: (_, v) =>
                  v && v.trim().length >= 2
                    ? Promise.resolve()
                    : Promise.reject(
                        "Product name must be at least 2 characters.",
                      ),
              },
            ]}
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
            rules={[{ required: true, message: "Category is required." }]}
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
            rules={[
              { required: true, message: "Description is required." },
              {
                min: 10,
                message: "Description must be at least 10 characters.",
              },
              {
                max: 5000,
                message: "Description cannot exceed 5000 characters.",
              },
            ]}
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
              rules={[
                { required: true, message: "Price is required." },
                {
                  type: "number",
                  min: 0.01,
                  max: 1000000,
                  message: "Price must be between 0.01 and 1,000,000.",
                },
              ]}
            >
              <InputNumber
                min={0.01}
                max={1000000}
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
              rules={[
                { required: true, message: "Stock is required." },
                {
                  type: "number",
                  min: 0,
                  max: 100000,
                  message: "Stock must be between 0 and 100,000.",
                },
                { type: "integer", message: "Stock must be a whole number." },
              ]}
            >
              <InputNumber
                min={0}
                max={100000}
                step={1}
                placeholder="10"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Form.Item label="Sizes (optional)" name="sizes">
            <Select
              mode="multiple"
              placeholder="Select sizes"
              options={SIZE_OPTIONS}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
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
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddProduct;