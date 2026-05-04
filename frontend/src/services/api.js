const BASE_API_URL =
  "https://zany-capybara-q49vw6vjwv934477-8080.app.github.dev";
const PRODUCTS_ENDPOINT = `${BASE_API_URL}/products`;
const CART_ENDPOINT = `${BASE_API_URL}/cart`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

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

export const getCart = async () => {
  const res = await fetch(CART_ENDPOINT, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Authentication required");
    throw new Error("Failed to fetch cart items");
  }

  return res.json();
};

export const addCartItem = async ({ productId, quantity }) => {
  const res = await fetch(`${CART_ENDPOINT}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Authentication required");
    throw new Error("Failed to add item to cart");
  }
};

export const updateCartItem = async ({ cartItemId, quantity }) => {
  const res = await fetch(`${CART_ENDPOINT}/items/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Authentication required");
    throw new Error("Failed to update cart item");
  }

  return res.json();
};

export const removeCartItem = async (cartItemId) => {
  const res = await fetch(`${CART_ENDPOINT}/items/${cartItemId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Authentication required");
    throw new Error("Failed to remove cart item");
  }
};

export const login = async (payload) => {
  const res = await fetch(`${BASE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.message || body || "Login failed");
  return body;
};

export const registerUser = async (payload) => {
  const res = await fetch(`${BASE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.message || body || "Registration failed");
  return body;
};
