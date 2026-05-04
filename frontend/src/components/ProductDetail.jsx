"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import { fetchProductById } from "../services/api";
import {
  optimisticAddToCart,
  optimisticUpdateQuantity,
  optimisticDeleteItem,
  selectCartItemByProductId,
} from "../store/cartSlice";

export default function ProductDetail() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cartItem = useSelector((state) =>
    selectCartItemByProductId(state, product?.id),
  );
  const cartQuantity = cartItem?.quantity ?? 0;

  useEffect(() => {
    if (!productId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const images = (product?.images?.length ? product.images : []).map((item) =>
    typeof item === "string" ? { imageUrl: item } : item,
  );
  const imageList =
    images.length > 0 ? images : [{ imageUrl: product?.thumbnail }];

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1,
    );
  };
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1,
    );
  };

  const increaseQuantity = async () => {
    if (!product || cartQuantity >= (product.stock ?? 0)) return;
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
      return;
    }

    try {
      if (!cartItem) {
        await dispatch(optimisticAddToCart({ product, quantity: 1 })).unwrap();
      } else {
        const cartItemId = cartItem.id ?? cartItem.productId;
        if (!cartItemId) {
          console.error("Missing cart item ID in product detail", cartItem);
          return;
        }
        await dispatch(
          optimisticUpdateQuantity({
            cartItemId,
            quantity: cartQuantity + 1,
            productId: product.id,
          }),
        ).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async () => {
    if (!product || !cartItem) return;
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
      return;
    }

    try {
      const cartItemId = cartItem.id ?? cartItem.productId;
      if (!cartItemId) {
        console.error("Missing cart item ID in product detail", cartItem);
        return;
      }

      if (cartQuantity <= 1) {
        await dispatch(optimisticDeleteItem({ cartItemId })).unwrap();
      } else {
        await dispatch(
          optimisticUpdateQuantity({
            cartItemId,
            quantity: cartQuantity - 1,
            productId: product.id,
          }),
        ).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    if (!product || (product.stock ?? 0) <= 0) return;
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(optimisticAddToCart({ product, quantity: 1 })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar search="" onSearch={() => {}} onCartClick={handleBack} />

      <div className="max-w-7xl mx-auto p-4">
        {/* Breadcrumb and Back */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-600 dark:hover:text-purple-400 transition"
            >
              Products
            </button>
            <span>/</span>
            <span
              className="hover:text-blue-600 dark:hover:text-purple-400 transition cursor-pointer"
              onClick={() => navigate(`/product-item/${productId}`)}
            >
              {product?.category || "Product"}
            </span>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">
              {product?.title || "Details"}
            </span>
          </div>
        </div>

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

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 lg:p-6 shadow-sm">
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Brand
                      </p>
                      <p>{product.brand}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Category
                      </p>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Stock
                      </p>
                      <p>{product.stock}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Discount
                      </p>
                      <p>{product.discountPercentage}%</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Rating
                      </p>
                      <p>
                        {product.rating?.rate ?? "N/A"} / 5 •{" "}
                        {product.rating?.count ?? "0"} reviews
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 lg:p-6 shadow-sm">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select quantity
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={decreaseQuantity}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        disabled={cartQuantity === 0}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[48px] text-center font-semibold text-gray-900 dark:text-gray-100">
                        {cartQuantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        disabled={cartQuantity >= (product.stock ?? 0)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={(product.stock ?? 0) <= 0}
                    className="w-full rounded-full bg-black dark:bg-purple-600 text-white py-3 font-semibold hover:bg-gray-800 dark:hover:bg-purple-700 transition disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-500"
                  >
                    {cartQuantity > 0 ? "Update Cart" : "Add to Cart"}
                  </button>

                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {product.stock > 0
                      ? `${product.stock - cartQuantity} left in stock`
                      : "Out of stock"}
                  </p>

                  {cartQuantity >= (product.stock ?? 0) &&
                    product.stock > 0 && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        You’ve reached the maximum available stock.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
