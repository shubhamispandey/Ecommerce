import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload;
      const stock = product.stock ?? Infinity;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity = Math.min(stock, existing.quantity + quantity);
      } else {
        state.items.push({
          id: product.id,
          product,
          quantity: Math.min(stock, quantity),
        });
      }
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === productId);
      if (!existing) return;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== productId);
      } else {
        existing.quantity = Math.min(
          existing.product.stock ?? quantity,
          quantity,
        );
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartQuantity = (state, productId) => {
  const item = state.cart.items.find((entry) => entry.id === productId);
  return item?.quantity ?? 0;
};
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
