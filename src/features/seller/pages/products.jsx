import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Tag,
    Dropdown,
    Empty,
    Skeleton,
    Modal,
    App as AntdApp,
} from "antd";
import {
    MdMoreVert,
    MdEdit,
    MdDelete,
    MdAdd,
    MdInventory2,
    MdWarningAmber,
} from "react-icons/md";
import {
    useSellerProducts,
    useDeleteSellerProduct,
} from "../hooks/useSellerProducts";
import UpdateStockModal from "../components/updateStockModal";

function SellerProducts() {
    const navigate = useNavigate();
    const { notification } = AntdApp.useApp();

    const { data: products = [], isLoading, isError } = useSellerProducts();
    const { mutate: deleteProduct, isPending: isDeleting } =
        useDeleteSellerProduct();

    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const confirmDelete = () => {
        if (!productToDelete) return;

        deleteProduct(productToDelete._id, {
            onSuccess: () => {
                notification.success({
                    title: "Product deleted",
                    description: `"${productToDelete.name}" was removed from your catalog.`,
                    placement: "bottomRight",
                });
                closeDeleteModal();
            },
            onError: (err) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to delete product.";
                notification.error({
                    title: "Could not delete product",
                    description: msg,
                    placement: "bottomRight",
                });
            },
        });
    };

    const handleOpenStockModal = (product) => {
        setSelectedProduct(product);
        setStockModalOpen(true);
    };

    const handleCloseStockModal = () => {
        setStockModalOpen(false);
        setSelectedProduct(null);
    };

    const rowMenuItems = (product) => [
        {
            key: "edit",
            label: "Edit Product",
            icon: <MdEdit />,
            onClick: () => navigate(`/seller/products/edit/${product._id}`),
        },
        {
            key: "stock",
            label: "Update Stock",
            icon: <MdInventory2 />,
            onClick: () => handleOpenStockModal(product),
        },
        { type: "divider" },
        {
            key: "delete",
            label: "Delete",
            icon: <MdDelete />,
            danger: true,
            onClick: () => openDeleteModal(product),
        },
    ];

    return (
        <div className="flex flex-col gap-4 md:gap-6 w-full min-w-0 max-w-[1600px] mx-auto">
       
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="min-w-0">
                    <h1 className="text-[22px] md:text-[26px] lg:text-[30px] font-bold text-slate-100 m-0 tracking-tight">
                        Studio Wares &amp; Catalog
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl font-medium">
                        Manage your product listings, prices, and inventory.
                    </p>
                </div>
                <div className="flex gap-2 md:gap-3 shrink-0">
                    <Button
                        type="primary"
                        icon={<MdAdd />}
                        className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 rounded-xl font-semibold text-xs md:text-sm"
                        onClick={() => navigate("/seller/products/new")}
                    >
                        Add New Product
                    </Button>
                </div>
            </div>

       
            <div className="flex flex-wrap gap-3 md:gap-4 w-full">
                <div
                    className="p-4 md:p-5 rounded-2xl w-[calc(50%-6px)] lg:flex-1 border border-slate-800"
                    style={{ background: "#1E293B" }}
                >
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider m-0">
                        Total Products
                    </p>
                    <p className="text-[24px] md:text-[30px] font-bold text-slate-100 m-0 mt-2 leading-none">
                        {products.length}
                    </p>
                </div>
                <div
                    className="p-4 md:p-5 rounded-2xl w-[calc(50%-6px)] lg:flex-1 border border-slate-800"
                    style={{ background: "#1E293B" }}
                >
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider m-0">
                        Active
                    </p>
                    <p className="text-[24px] md:text-[30px] font-bold text-green-400 m-0 mt-2 leading-none">
                        {products.filter((p) => p.status === "active").length}
                    </p>
                </div>
            </div>

           
            <div
                className="rounded-2xl border border-slate-800 overflow-hidden w-full min-w-0"
                style={{ background: "#1E293B" }}
            >
                <div className="hidden md:flex items-center gap-4 px-5 py-3 border-b border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 tracking-wider flex-1">
                        PRODUCT
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 tracking-wider w-32">
                        CATEGORY
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 tracking-wider w-24 text-right">
                        PRICE
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 tracking-wider w-24 text-right">
                        STOCK
                    </span>
                    <span className="w-8" />
                </div>

                {isLoading && (
                    <div className="flex flex-col gap-3 p-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} active paragraph={{ rows: 1 }} />
                        ))}
                    </div>
                )}

                {!isLoading && isError && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        Failed to load products.
                    </div>
                )}
                {!isLoading && !isError && products.length === 0 && (
                    <div className="p-8">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-slate-500 text-sm">
                                    No products found
                                </span>
                            }
                        />
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    products.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition-colors cursor-pointer"
                            onClick={() =>
                                navigate(`/seller/products/${product._id}`)
                            }
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-600">
                                    <img
                                        src={product.image?.url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0 gap-0.5">
                                    <span className="text-[13px] md:text-sm font-bold text-slate-100 line-clamp-1 capitalize">
                                        {product.name}
                                    </span>
                                    <span className="text-[10px] md:text-[11px] text-slate-500 line-clamp-1">
                                        {product.description}
                                    </span>
                                    <div className="flex md:hidden items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-slate-500">
                                            {product.category}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-200">
                                            ${product.price}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            Stock {product.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <span className="hidden md:block text-xs text-slate-400 w-32 truncate">
                                {product.category}
                            </span>
                            <span className="hidden md:block text-[13px] font-bold text-slate-100 w-24 text-right">
                                ${product.price}
                            </span>
                            <span className="hidden md:flex w-24 justify-end">
                                <Tag
                                    className={`m-0 border-0 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        product.stock > 10
                                            ? "bg-green-900/30 text-green-400"
                                            : product.stock > 0
                                              ? "bg-yellow-900/30 text-yellow-400"
                                              : "bg-red-900/30 text-red-400"
                                    }`}
                                >
                                    {product.stock}
                                </Tag>
                            </span>

                            <div
                                onClick={(e) => e.stopPropagation()} className="shrink-0" >
                                <Dropdown
                                    menu={{ items: rowMenuItems(product) }}
                                    placement="bottomRight"
                                    trigger={["click"]}
                                >
                                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
                                        <MdMoreVert size={18} />
                                    </button>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
            </div>

            <UpdateStockModal
                open={stockModalOpen}
                onClose={handleCloseStockModal}
                product={selectedProduct}
            />

            <Modal
                open={deleteModalOpen}
                onCancel={closeDeleteModal}
                title={
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-red-900/30 text-red-400">
                            <MdWarningAmber size={16} />
                        </div>
                        <span className="font-bold text-slate-100">
                            Delete product?
                        </span>
                    </div>
                }
                footer={[
                    <Button
                        key="cancel"
                        onClick={closeDeleteModal}
                        disabled={isDeleting}
                        className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg"
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="delete"
                        danger
                        type="primary"
                        loading={isDeleting}
                        onClick={confirmDelete}
                        className="rounded-lg"
                    >
                        Delete
                    </Button>,
                ]}
                centered
                destroyOnClose
            >
                <p className="text-sm text-slate-400 m-0 leading-relaxed">
                    <span className="font-semibold text-slate-200">
                        "{productToDelete?.name}"
                    </span>{" "}
                    will be permanently removed. This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
}

export default SellerProducts;