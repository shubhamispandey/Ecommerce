"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import { fetchProductById } from "../services/api";

export default function ProductDetail() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        setCurrentImageIndex(0);
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

  const images = product?.images || [product?.thumbnail];
  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Navbar
        cartCount={0}
        search=""
        onSearch={() => {}}
        onCartClick={handleBack}
      />

      <div className="max-w-7xl mx-auto p-4">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-600 dark:hover:text-purple-400 transition"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">
            {product?.category || "Product"}
          </span>
        </div>

        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {isLoading && <Loader />}

        {isError && (
          <EmptyState message="Unable to load product details. Please try again." />
        )}

        {!isLoading && product && (
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
            {/*Image Carousel*/}
            <div className="sticky top-20">
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                <img
                  src={images[currentImageIndex].imageUrl}
                  alt={product.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-contain p-4 bg-gray-50 dark:bg-gray-800"
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft
                        size={20}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight
                        size={20}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 rounded-full transition ${
                            idx === currentImageIndex
                              ? "bg-blue-600 dark:bg-purple-500 w-6"
                              : "bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500"
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {product.title}
                </h1>
                <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 mb-4">
                  {product.category}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300">
                      {product.rating?.rate ?? "N/A"} •{" "}
                      {product.rating?.count ?? "0"} reviews
                    </span>
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-purple-900/30 px-4 py-3 border border-transparent dark:border-purple-700/50">
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                      Price
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-blue-900 dark:text-purple-300">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 lg:p-6 shadow-sm">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Product Details
                </h2>
                <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs Grid */}
              {product.specs && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800"
                    >
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        {key}
                      </p>
                      <p className="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
