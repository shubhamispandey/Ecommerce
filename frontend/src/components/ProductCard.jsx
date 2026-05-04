"use client";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Star, Plus, Minus } from "lucide-react";
import {
  optimisticAddToCart,
  optimisticUpdateQuantity,
  deleteCartItem,
  selectCartItemByProductId,
} from "../store/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItem = useSelector((state) =>
    selectCartItemByProductId(state, product.id),
  );
  const quantity = cartItem?.quantity ?? 0;

  const stock = product.stock ?? Infinity;
  const canAddMore = quantity < stock;

  const handleAddToCart = async (event) => {
    event?.stopPropagation();
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
      return;
    }
    if (stock <= 0) return;

    try {
      await dispatch(optimisticAddToCart({ product, quantity: 1 })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrease = async (event) => {
    event?.stopPropagation();
    if (!canAddMore) return;
    if (!cartItem) {
      return handleAddToCart(event);
    }

    try {
      const cartItemId = cartItem.id ?? cartItem.productId;
      if (!cartItemId) {
        console.error("Missing cart item ID for update", cartItem);
        return;
      }

      await dispatch(
        optimisticUpdateQuantity({
          cartItemId,
          quantity: quantity + 1,
          productId: product.id,
        }),
      ).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrease = async (event) => {
    event?.stopPropagation();
    if (!cartItem) return;

    try {
      const cartItemId = cartItem.id ?? cartItem.productId;
      if (!cartItemId) {
        console.error("Missing cart item ID for update", cartItem);
        return;
      }

      if (quantity > 1) {
        await dispatch(
          optimisticUpdateQuantity({
            cartItemId,
            quantity: quantity - 1,
            productId: product.id,
          }),
        ).unwrap();
      } else {
        await dispatch(deleteCartItem({ cartItemId })).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDetail = () => {
    navigate(`/product-item/${product.id}`);
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="cursor-pointer border rounded-xl p-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:shadow-lg transition flex flex-col"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-40 object-contain mb-3"
      />

      <h2 className="text-sm font-medium line-clamp-2 min-h-[40px] text-gray-900 dark:text-gray-100">
        {product.title}
      </h2>

      <div className="flex items-center gap-1 text-yellow-500 mt-1">
        <Star size={14} fill="currentColor" />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {product.rating?.rate || 4}
        </span>
      </div>

      <p className="font-bold mt-2 text-gray-900 dark:text-gray-100">
        ${product.price}
      </p>

      {quantity === 0 ? (
        <button
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className="mt-auto rounded-md py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 bg-black dark:bg-purple-600 hover:bg-gray-800 dark:hover:bg-purple-700"
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      ) : (
        <div className="mt-auto flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-2">
          <button
            onClick={handleDecrease}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Minus size={16} />
          </button>
          <span className="font-semibold text-sm w-8 text-center text-gray-900 dark:text-gray-100">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={!canAddMore}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
