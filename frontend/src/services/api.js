export const fetchProducts = async (query = "") => {
  const url = query
    ? `https://super-duper-carnival-p4r9v779rjq364j7-8080.app.github.dev/products/search?q=${encodeURIComponent(query)}`
    : "https://super-duper-carnival-p4r9v779rjq364j7-8080.app.github.dev/products";

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(
    `https://super-duper-carnival-p4r9v779rjq364j7-8080.app.github.dev/products/${id}`
  );

  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
};