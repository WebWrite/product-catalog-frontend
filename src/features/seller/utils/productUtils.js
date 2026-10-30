export const formatPrice = (price) =>
  new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

export const getStockStatus = (stock) => {
  if (stock <= 0) {
    return {
      label: "Out of Stock",
      className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    };
  }

  if (stock <= 10) {
    return {
      label: "Low Stock",
      className:
        "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
    };
  }

  return {
    label: "In Stock",
    className:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  };
};
