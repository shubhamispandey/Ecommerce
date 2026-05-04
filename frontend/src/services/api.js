const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ENDPOINT = `${BASE_API_URL}/products`;

export const fetchProducts = async (query = "") => {
  const url = query
    ? `${PRODUCTS_ENDPOINT}/search?q=${encodeURIComponent(query)}`
    : PRODUCTS_ENDPOINT;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${PRODUCTS_ENDPOINT}/${id}`);

  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
};
