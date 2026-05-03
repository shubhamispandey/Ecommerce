"use client";

import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";

export default function Navbar({ cartCount = 0, search = "", onSearch = () => {}, onCartClick = () => {} }) {
  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <div className="text-lg font-semibold whitespace-nowrap">
          MyStore
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-full max-w-2xl flex items-center border border-blue-400 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-200">
            
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              className="w-full px-3 text-sm outline-none bg-transparent"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6 text-sm whitespace-nowrap">
          
          {/* LOGIN */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <User size={18} />
            <span className="hidden sm:inline">Login</span>
            <ChevronDown size={14} />
          </div>

          {/* MORE */}
          <div className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <span>More</span>
            <ChevronDown size={14} />
          </div>

          {/* CART */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 relative"
            onClick={onCartClick}
            role="button"
            tabIndex={0}
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Cart</span>

            {/* Cart Badge */}
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {cartCount}
            </span>
          </div>

        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center border rounded-full px-4 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 text-sm outline-none"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

    </header>
  );
}