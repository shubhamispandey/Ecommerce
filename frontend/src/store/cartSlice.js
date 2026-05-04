import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "../services/api";

const initialState = {
  items: [],
  pendingOperations: {}, // Track pending API calls by cartItemId
};

// Debounce utility
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async (_, { rejectWithValue }) => {
    try {
      const cartItems = await getCart();
      return cartItems;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load cart");
    }
  },
);

export const createCartItem = createAsyncThunk(
  "cart/createCartItem",
  async ({ product, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await addCartItem({ productId: product.id, quantity });
      await dispatch(loadCart());
    } catch (error) {
      return rejectWithValue(error.message || "Unable to add item to cart");
    }
  },
);

// Optimistic update with debouncing
const debouncedUpdateCartItem = debounce(
  async (cartItemId, quantity, dispatch) => {
    try {
      await updateCartItem({ cartItemId, quantity });
      dispatch(loadCart()); // Refresh from server after successful update
    } catch (error) {
      console.error("Failed to sync cart item:", error);
      // On failure, reload cart to revert optimistic update
      dispatch(loadCart());
    } finally {
      dispatch(cartSlice.actions.clearPendingOperation(cartItemId));
    }
  },
  500,
);

export const optimisticUpdateQuantity = createAsyncThunk(
  "cart/optimisticUpdateQuantity",
  async ({ cartItemId, quantity, productId }, { dispatch, getState }) => {
    const state = getState();
    const existingItem = state.cart.items.find(
      (item) => (item.id ?? item.productId) === cartItemId,
    );

    if (!existingItem) return;

    // Optimistically update UI
    dispatch(
      cartSlice.actions.updateQuantityOptimistic({
        cartItemId,
        quantity,
        productId: existingItem.productId,
      }),
    );

    // Mark as pending
    dispatch(cartSlice.actions.setPendingOperation(cartItemId));

    // Debounced API call
    debouncedUpdateCartItem(cartItemId, quantity, dispatch);
  },
);

export const optimisticDeleteItem = createAsyncThunk(
  "cart/optimisticDeleteItem",
  async ({ cartItemId }, { dispatch }) => {
    // Optimistically remove from UI
    dispatch(cartSlice.actions.removeItemOptimistic(cartItemId));

    // Mark as pending
    dispatch(cartSlice.actions.setPendingOperation(cartItemId));

    // Debounced API call
    const debouncedDelete = debounce(async () => {
      try {
        await removeCartItem(cartItemId);
        dispatch(loadCart()); // Refresh from server
      } catch (error) {
        console.error("Failed to delete cart item:", error);
        dispatch(loadCart()); // Revert on failure
      } finally {
        dispatch(cartSlice.actions.clearPendingOperation(cartItemId));
      }
    }, 500);

    debouncedDelete();
  },
);

export const optimisticAddToCart = createAsyncThunk(
  "cart/optimisticAddToCart",
  async ({ product, quantity }, { dispatch, getState }) => {
    const state = getState();
    const existingItem = state.cart.items.find(
      (item) => item.productId === product.id,
    );

    if (existingItem) {
      // Update existing item optimistically
      const newQuantity = existingItem.quantity + quantity;
      dispatch(
        optimisticUpdateQuantity({
          cartItemId: existingItem.id ?? existingItem.productId,
          quantity: newQuantity,
          productId: product.id,
        }),
      );
    } else {
      // Add new item optimistically
      dispatch(
        cartSlice.actions.addItemOptimistic({
          product,
          quantity,
        }),
      );

      // Debounced API call
      const debouncedAdd = debounce(async () => {
        try {
          await addCartItem({ productId: product.id, quantity });
          dispatch(loadCart()); // Refresh from server
        } catch (error) {
          console.error("Failed to add cart item:", error);
          dispatch(loadCart()); // Revert on failure
        }
      }, 500);

      debouncedAdd();
    }
  },
);

export const changeCartQuantity = createAsyncThunk(
  "cart/changeCartQuantity",
  async ({ cartItemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await updateCartItem({ cartItemId, quantity });
      await dispatch(loadCart());
    } catch (error) {
      return rejectWithValue(error.message || "Unable to update cart item");
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ cartItemId }, { dispatch, rejectWithValue }) => {
    try {
      await removeCartItem(cartItemId);
      await dispatch(loadCart());
    } catch (error) {
      return rejectWithValue(error.message || "Unable to remove cart item");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.pendingOperations = {};
    },
    setCartItems(state, action) {
      state.items = action.payload;
    },
    setPendingOperation(state, action) {
      state.pendingOperations[action.payload] = true;
    },
    clearPendingOperation(state, action) {
      delete state.pendingOperations[action.payload];
    },
    updateQuantityOptimistic(state, action) {
      const { cartItemId, quantity, productId } = action.payload;
      const item = state.items.find(
        (item) =>
          (item.id ?? item.productId) === cartItemId ||
          item.productId === productId,
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i !== item);
        } else {
          item.quantity = quantity;
        }
      }
    },
    removeItemOptimistic(state, action) {
      const cartItemId = action.payload;
      state.items = state.items.filter(
        (item) => (item.id ?? item.productId) !== cartItemId,
      );
    },
    addItemOptimistic(state, action) {
      const { product, quantity } = action.payload;
      const existing = state.items.find(
        (item) => item.productId === product.id,
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id: product.id, // Temporary ID until server sync
          productId: product.id,
          product,
          quantity,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.items = action.payload
        .filter((item) => item?.productId != null)
        .map((item) => ({
          id: item.id ?? item.productId,
          productId: item.productId,
          product: {
            id: item.productId,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail,
          },
          quantity: item.quantity,
        }));
      state.pendingOperations = {}; // Clear pending operations on successful load
    });
    builder.addCase(loadCart.rejected, (state) => {
      state.pendingOperations = {}; // Clear pending operations on failure
    });
  },
});

export const {
  clearCart,
  setCartItems,
  setPendingOperation,
  clearPendingOperation,
  updateQuantityOptimistic,
  removeItemOptimistic,
  addItemOptimistic,
} = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemByProductId = (state, productId) =>
  state.cart.items.find((entry) => entry.productId === productId);
export const selectCartQuantity = (state, productId) => {
  const item = state.cart.items.find((entry) => entry.productId === productId);
  return item?.quantity ?? 0;
};
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectIsOperationPending = (state, cartItemId) =>
  state.cart.pendingOperations[cartItemId] || false;

export default cartSlice.reducer;
