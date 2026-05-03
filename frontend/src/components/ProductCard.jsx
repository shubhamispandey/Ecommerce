"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Plus, Minus } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  const handleAddToCart = (event) => {
    event?.stopPropagation();
    setQuantity(1);
    onAddToCart();
  };

  const handleIncrease = (event) => {
    event?.stopPropagation();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAddToCart();
  };

  const handleDecrease = (event) => {
    event?.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onAddToCart(-1);
    } else if (quantity === 1) {
      setQuantity(0);
      onAddToCart(-1);
    }
  };

  const handleOpenDetail = () => {
    navigate(`/product-item?id=${product.id}`);
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="cursor-pointer border rounded-xl p-4 bg-white hover:shadow-lg transition flex flex-col"
    >
      
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-40 object-contain mb-3"
      />

      <h2 className="text-sm font-medium line-clamp-2 min-h-[40px]">
        {product.title}
      </h2>

      <div className="flex items-center gap-1 text-yellow-500 mt-1">
        <Star size={14} fill="currentColor" />
        <span className="text-xs text-gray-600">
          {product.rating?.rate || 4}
        </span>
      </div>

      <p className="font-bold mt-2">${product.price}</p>

      {quantity === 0 ? (
        <button 
          onClick={handleAddToCart}
          className="mt-auto bg-black text-white py-2 rounded-md hover:bg-gray-800 font-medium">
          Add to Cart
        </button>
      ) : (
        <div className="mt-auto flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2">
          <button
            onClick={handleDecrease}
            className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300">
            <Minus size={16} />
          </button>
          <span className="font-semibold text-sm w-8 text-center">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300">
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}