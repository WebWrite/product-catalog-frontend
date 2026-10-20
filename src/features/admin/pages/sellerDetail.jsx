import { Link, useNavigate, useParams } from "react-router-dom";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Result,
  Select,
  Tag,
} from "antd";
import { MdArrowBack, MdOutlineStorefront } from "react-icons/md";
import { money } from "../../../shared/utils/currency";
import { CATEGORIES, STATUS_TAG } from "../constant/constant";
const SELLERS = [
  {
    id: 1,
    store: "Studio Kanso",
    handle: "studiokanso",
    owner: "Kenji Takahashi",
    email: "kenji@studiokanso.jp",
    category: "Ceramics & Tableware",
    products: 42,
    gmv: 14250,
    orders: 94,
    commission: 12,
    status: "active",
    description: "Small-batch ceramics from Kyoto.",
  },
  {
    id: 2,
    store: "Echizen Craft",
    handle: "echizencraft",
    owner: "Sora Masuda",
    email: "support@echizencraft.co",
    category: "Kitchen & Dining",
    products: 28,
    gmv: 28940,
    orders: 142,
    status: "inactive",
    commission: 12,
    description: "Traditional Echizen knives and cookware.",
  },
  {
    id: 3,
    store: "Oak Woodcraft",
    handle: "oakwoodcraft",
    owner: "Lars Lindqvist",
    email: "lars@oakwoodcraft.se",
    category: "Furniture",
    products: 15,
    gmv: 19400,
    status: "active",
    orders: 22,
    commission: 10,

    description: "Solid oak furniture made in Sweden.",
  },
  {
    id: 4,
    store: "Pure Linen Lab",
    handle: "purelinenlab",
    owner: "Camille Laurent",
    email: "contact@purelinen.fr",
    category: "Textiles",
    products: 36,
    gmv: 11820,
    status: "active",
    orders: 78,
    commission: 12,
    description: "Washed linen bedding and towels.",
  },
  {
    id: 5,
    store: "Ceramic Studio Co",
    handle: "ceramic-studio-co",
    owner: "Beatriz Ramos Carvalho",
    email: "b.carvalho@ceramicstudio.pt",
    category: "Ceramics & Tableware",
    products: 12,
    gmv: 0,
    status: "inactive",
    orders: 0,
    commission: 12,
    description: "New applicant from Lisbon.",
  },
  {
    id: 6,
    store: "Alpine Woodworks",
    handle: "alpinewood",
    owner: "Markus Steiner",
    email: "m.steiner@alpinewood.at",
    category: "Furniture & Wood",
    products: 19,
    gmv: 1890,
    orders: 0,
    status: "active",
    commission: 10,
    description: "Alpine timber furniture.",
  },
];

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-indigo-50/60 p-3">
      <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <p className="m-0 mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [form] = Form.useForm();

  const seller = SELLERS.find((s) => String(s.id) === id);

  if (!seller) {
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

  const tag = STATUS_TAG[seller.status];

  const handleSave = (values) => {
    notification.success({
      title: "Seller updated",
      description: `${values.store} was saved successfully`,
      placement: "bottomRight",
    });
    navigate("/admin/sellers");
  };

  const setStatus = (status) => form.setFieldValue("status", status);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 ">
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
            {seller.store}
          </h1>
          <p className="m-0 font-mono text-[11px] text-slate-500">
            aura.market/{seller.handle}
          </p>
        </div>
        <Tag color={tag.color} className="m-0!">
          {tag.label}
        </Tag>
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
            initialValues={seller}
            onFinish={handleSave}
          >
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Form.Item
                label="Store Name"
                name="store"
                rules={[
                  { required: true, message: "Store name is required" },
                  { min: 3, message: "At least 3 characters" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              </Form.Item>

              <Form.Item label="Status" name="status">
                <Select
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "In Active" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Commission Rate" name="commission">
                <InputNumber min={0} max={50} suffix="%" className="w-full!" />
              </Form.Item>
            </div>

            <Form.Item label="Store Description" name="description">
              <Input.TextArea rows={3} maxLength={300} showCount />
            </Form.Item>

            <div className="flex flex-wrap justify-end gap-3">
              <Button onClick={() => navigate("/admin/sellers")}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-indigo-700!"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="m-0 text-sm font-bold text-slate-900">
              Performance
            </h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-3 ">
              <Stat label="Monthly GMV" value={money(seller.gmv)} />
              <Stat label="Orders" value={seller.orders} />
              <Stat label="Products" value={seller.products} />
            </div>
            <p className="m-0 mt-3 text-[11px] text-slate-500">
              {seller.payoutNote}
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="m-0 text-sm font-bold text-slate-900">
              Quick Actions
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              <Button danger onClick={() => setStatus("suspended")}>
                Suspend Store
              </Button>
            </div>
            <p className="m-0 mt-3 text-[11px] text-slate-500">
              These buttons change the Status field. Click Save Changes to
              apply.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default SellerDetail;
