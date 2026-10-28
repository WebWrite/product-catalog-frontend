export const formatPrice = (price) =>
  new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

export const getStockStatus = (stock) => {
  const quantity = Number(stock) || 0;

  if (quantity <= 0) {
    return {
      label: "Dead Stock",
      className: "bg-red-900/30 text-red-400",
    };
  }

  if (quantity <= 10) {
    return {
      label: "Low Stock",
      className: "bg-yellow-900/30 text-yellow-400",
    };
  }

  return {
    label: "In Stock",
    className: "bg-green-900/30 text-green-400",
  };
};
