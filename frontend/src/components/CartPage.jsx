"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronLeft } from "lucide-react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import { fetchCart } from "../services/api";

export default function CartPage({ onBack }) {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cartData?.carts?.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;

  const totalItems = cartData?.carts?.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0) || 0;

  return (
    <>
      <Navbar
        cartCount={totalItems}
        search=""
        onSearch={() => {}}
        onCartClick={onBack}
      />

      <div className="max-w-7xl mx-auto p-4">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-sm text-gray-500">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>
        </div>

        {isLoading && <Loader />}

        {isError && (
          <EmptyState message="Failed to load cart items" />
        )}

        {!isLoading && !isError && (!cartData?.carts || cartData.carts.length === 0) && (
          <EmptyState message="Your cart is empty" />
        )}

        {!isLoading && !isError && cartData?.carts && cartData.carts.length > 0 && (
          <div className="space-y-4">
            {cartData.carts.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  {item.product?.thumbnail && (
                    <img
                      src={item.product.thumbnail}
                      alt={item.product?.title || "Product"}
                      className="h-24 w-24 rounded-lg object-contain bg-gray-50"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {item.product?.title || "Unknown Product"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      ${(item.product?.price || 0).toFixed(2)} each
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="text-lg font-bold">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    title="Remove from cart"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold">{totalItems}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <button className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition w-full sm:w-auto">
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
