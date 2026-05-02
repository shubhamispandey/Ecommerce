package com.example.ecommerce.controller;

import com.example.ecommerce.dto.PageResponse;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public PageResponse<Product> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "30") int limit) {
        Page<Product> products = productService.getAllProducts(page, limit);
        return new PageResponse<>(products.getContent(), products.getTotalElements(), page * limit, limit);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/search")
    public PageResponse<Product> searchProducts(@RequestParam("q") String query,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "30") int limit) {
        Page<Product> products = productService.searchProducts(query, page, limit);
        return new PageResponse<>(products.getContent(), products.getTotalElements(), page * limit, limit);
    }
}