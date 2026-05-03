"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import { fetchProductById } from "../services/api";

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const productId = searchParams.get("id");

  useEffect(() => {
    if (!productId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product details:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleBack = () => navigate(-1);

  return (
    <>
      <Navbar cartCount={0} search="" onSearch={() => {}} onCartClick={handleBack} />

      <div className="max-w-7xl mx-auto p-4">
        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        {isLoading && <Loader />}

        {isError && (
          <EmptyState message="Unable to load product details. Please try again." />
        )}

        {!isLoading && product && (
          <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full rounded-3xl object-contain bg-gray-50"
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    <p className="mt-2 text-sm text-gray-500">{product.category}</p>
                  </div>

                  <div className="rounded-3xl bg-blue-50 px-4 py-3 text-right">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-3xl font-semibold text-blue-900">
                      ${product.price}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm text-gray-700">
                    {product.rating?.rate ?? "N/A"} • {product.rating?.count ?? "0"} reviews
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Product details</h2>
                <p className="mt-4 text-gray-700 leading-7">{product.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
