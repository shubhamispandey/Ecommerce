"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/api";

export const useProducts = (query = "") => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => fetchProducts(query),
    keepPreviousData: true,
  });
};