"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, ShoppingCart, User, ChevronDown, LogOut, UserCircle } from "lucide-react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export default function Navbar({ cartCount = 0, search = "", onSearch = () => {}, onCartClick = () => {} }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Initialize login state from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserData(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserData(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
      toast.success("Logged in successfully");
    }
  };

  const handleSignUpSuccess = () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserData(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
      toast.success("Account created successfully");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setShowUserDropdown(false);
  };

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
          
          {/* LOGIN/USER */}
          {isLoggedIn && userData ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
              >
                <UserCircle size={20} />
                <span className="hidden sm:inline">
                  {userData.name || userData.username || "User"}
                </span>
                <ChevronDown size={16} />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCircle size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {userData.name || userData.username || `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User"}
                        </p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="px-2 py-2 text-sm text-gray-600 border-b border-gray-100">
                      <p><span className="font-medium">Username:</span> {userData.username}</p>
                      {userData.id && (
                        <p><span className="font-medium">ID:</span> {userData.id}</p>
                      )}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition rounded"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition"
              >
                <User size={18} />
                <span className="hidden sm:inline">Login</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setShowSignUpModal(true)}
                className="text-blue-600 font-medium hover:text-blue-800 transition text-xs hidden sm:inline"
              >
                Sign Up
              </button>
            </div>
          )}

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

      {/* Login and SignUp Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
        onSignUpSuccess={handleSignUpSuccess}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </header>
  );
}