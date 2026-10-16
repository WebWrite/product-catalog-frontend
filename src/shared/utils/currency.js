export const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "pkr" }).format(
    n,
  );
