"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronLeft } from "lucide-react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

export default function CartPage({ onBack }) {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://super-duper-carnival-p4r9v779rjq364j7-8080.app.github.dev/products/carts",
        );
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCartData(data);
        setIsError(false);
      } catch (error) {
        console.error("Cart fetch error:", error);
        setIsError(true);
        setCartData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const totalPrice =
    cartData?.carts?.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

  const totalItems =
    cartData?.carts?.reduce((sum, item) => {
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

        {!isLoading &&
          !isError &&
          (!cartData?.carts || cartData.carts.length === 0) && (
            <EmptyState message="Your cart is empty" />
          )}

        {!isLoading &&
          !isError &&
          cartData?.carts &&
          cartData.carts.length > 0 && (
            <div className="space-y-4">
              {cartData.carts.map((item, idx) => (
                <div
                  key={idx}
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
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end gap-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Subtotal
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        $
                        {((item.product?.price || 0) * item.quantity).toFixed(
                          2,
                        )}
                      </p>
                    </div>
                    <button
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
