"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown, LogOut } from "lucide-react";
import { selectCartCount, loadCart, clearCart } from "../store/cartSlice";

export default function Navbar({
  search = "",
  onSearch = () => {},
  onCartClick = () => {},
}) {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const updateAuthState = async () => {
      const storedUser = localStorage.getItem("authUser");
      setLoggedInUser(storedUser);

      if (localStorage.getItem("authToken")) {
        try {
          await dispatch(loadCart()).unwrap();
        } catch (error) {
          console.warn("Unable to load cart after auth state updated", error);
        }
      }
    };

    updateAuthState();
    const authListener = () => {
      updateAuthState();
    };

    window.addEventListener("authChanged", authListener);
    return () => window.removeEventListener("authChanged", authListener);
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    dispatch(clearCart());
    setLoggedInUser(null);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const handleCartClick = () => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
      return;
    }
    onCartClick();
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* LOGO */}
        <div className="text-lg font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100">
          MyStore
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-full max-w-2xl flex items-center border border-blue-400 dark:border-purple-500 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-purple-500/30 dark:bg-gray-800">
            <Search size={18} className="text-gray-500 dark:text-gray-400" />

            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              className="w-full px-3 text-sm outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
          {/* LOGIN OR USER */}
          {loggedInUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100">
                <User size={18} />
                <span className="hidden sm:inline font-medium">
                  {loggedInUser}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-2 text-white hover:bg-red-600 transition"
                type="button"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-purple-400 transition"
              onClick={() => navigate("/login")}
              role="button"
              tabIndex={0}
            >
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
              <ChevronDown size={14} />
            </div>
          )}

          {/* MORE */}
          <div className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-purple-400 transition">
            <span>More</span>
            <ChevronDown size={14} />
          </div>

          {/* CART */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-purple-400 relative transition"
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
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 dark:bg-gray-800">
          <Search size={18} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 text-sm outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
