"use client";

import { ShoppingCart, Search } from "lucide-react";
import { useSelector } from "react-redux";

export default function Header({ search, setSearch }) {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-slate-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-3xl bg-slate-900 dark:bg-purple-600 px-4 py-2 text-white text-lg font-semibold shadow-sm">
            MyStore
          </div>
          <p className="hidden text-sm text-slate-600 dark:text-gray-400 sm:block">
            Premium deals for modern shoppers.
          </p>
        </div>

        <div className="relative w-full sm:max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            className="w-full rounded-full border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 px-12 py-3 text-sm text-slate-900 dark:text-gray-100 shadow-sm outline-none transition focus:border-blue-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-purple-500/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 dark:shadow-purple-600/10 transition hover:bg-slate-800 dark:hover:bg-purple-700">
          <ShoppingCart size={18} />
          Cart
          <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white">
            {cartItems.length}
          </span>
        </button>
      </div>
    </header>
  );
}
