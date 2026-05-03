package com.example.ecommerce.controller;

import com.example.ecommerce.dto.AddToCartRequest;
import com.example.ecommerce.dto.CartItemResponse;
import com.example.ecommerce.dto.UpdateCartItemRequest;
import com.example.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Cart management APIs")
public class CartController {

    private final CartService cartService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Long) {
            return (Long) auth.getDetails();
        }
        throw new RuntimeException("User not authenticated");
    }

    @PostMapping("/items")
    public ResponseEntity<Void> addToCart(@RequestBody AddToCartRequest request) {
        Long userId = getCurrentUserId();
        cartService.addItemToCart(userId, request.getProductId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @PathVariable Long id,
            @RequestBody UpdateCartItemRequest request) {
        CartItemResponse response = cartService.updateCartItemQuantity(id, request.getQuantity());
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long id) {
        cartService.removeCartItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart() {
        Long userId = getCurrentUserId();
        List<CartItemResponse> items = cartService.getCartItems(userId);
        return ResponseEntity.ok(items);
    }
}