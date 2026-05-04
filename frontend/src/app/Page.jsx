"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "../hooks/useProducts";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const queryClient = new QueryClient();

function HomePage({ onNavigateToCart }) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useProducts(search.trim());

  return (
    <>
      <Navbar
        search={search}
        onSearch={setSearch}
        onCartClick={onNavigateToCart}
      />

      <div className="max-w-7xl mx-auto p-4">
        {isLoading && <Loader />}
        {isError && <EmptyState message="Failed to load products" />}
        {data && (
          <ProductList products={data.products} />
        )}
      </div>
    </>
  );
}

export default function Page({ onNavigateToCart }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage onNavigateToCart={onNavigateToCart} />
    </QueryClientProvider>
  );
}
