package com.example.ecommerce.controller;

import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Cart management APIs")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public void addToCart(@RequestBody Map<String, Object> request) {
        Long userId = ((Number) request.get("userId")).longValue();
        Long productId = ((Number) request.get("productId")).longValue();
        Integer quantity = ((Number) request.get("quantity")).intValue();
        cartService.addItemToCart(userId, productId, quantity);
    }

    @GetMapping
    public List<CartItem> getCart(@RequestParam Long userId) {
        return cartService.getCartItems(userId);
    }
}