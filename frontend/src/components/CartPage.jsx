"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ChevronLeft, Minus, Plus } from "lucide-react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import {
  addToCart,
  selectCartItems,
  updateQuantity,
  removeFromCart,
  selectCartCount,
} from "../store/cartSlice";

export default function CartPage({ onBack }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const totalPrice =
    cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

  return (
    <>
      <Navbar search="" onSearch={() => {}} onCartClick={onBack} />

      <div className="max-w-7xl mx-auto p-4">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-blue-600 dark:text-purple-400 hover:text-blue-800 dark:hover:text-purple-300 font-medium transition"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>
        </div>

        {isLoading && <Loader />}

        {isError && <EmptyState message="Failed to load cart items" />}

        {!isLoading && !isError && cartItems.length === 0 && (
          <EmptyState message="Your cart is empty" />
        )}

        {!isLoading && !isError && cartItems.length > 0 && (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  {item.product?.thumbnail && (
                    <img
                      src={item.product.thumbnail}
                      alt={item.product?.title || "Product"}
                      className="h-24 w-24 rounded-lg object-contain bg-gray-50 dark:bg-gray-800"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {item.product?.title || "Unknown Product"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${(item.product?.price || 0).toFixed(2)} each
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.id,
                              quantity: Math.max(0, item.quantity - 1),
                            }),
                          )
                        }
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[36px] text-center font-semibold text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            addToCart({ product: item.product, quantity: 1 }),
                          )
                        }
                        disabled={
                          item.quantity >= (item.product.stock ?? Infinity)
                        }
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Subtotal
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="rounded-full bg-red-500 dark:bg-red-600 p-2 text-white hover:bg-red-600 dark:hover:bg-red-700 transition"
                    title="Remove from cart"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Items
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {totalItems}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Price
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <button className="rounded-full bg-green-600 dark:bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 dark:hover:bg-green-700 transition w-full sm:w-auto">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
