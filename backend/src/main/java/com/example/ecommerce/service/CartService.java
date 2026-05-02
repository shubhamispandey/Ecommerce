package com.example.ecommerce.service;

import com.example.ecommerce.dto.CartItemResponse;
import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public Cart getOrCreateCart(Long userId) {
        Optional<Cart> cart = cartRepository.findByUserId(userId);
        if (cart.isPresent()) {
            return cart.get();
        }
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        return cartRepository.save(newCart);
    }

    public void addItemToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        // Check if item already exists
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        Optional<CartItem> existing = items.stream().filter(i -> i.getProductId().equals(productId)).findFirst();
        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + quantity);
            cartItemRepository.save(existing.get());
        } else {
            CartItem item = new CartItem();
            item.setCartId(cart.getId());
            item.setProductId(productId);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }

    public List<CartItemResponse> getCartItems(Long userId) {
        Cart cart = getOrCreateCart(userId);
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        
        return cartItems.stream()
            .map(cartItem -> {
                Optional<Product> product = productRepository.findById(cartItem.getProductId());
                if (product.isPresent()) {
                    Product p = product.get();
                    return new CartItemResponse(
                        cartItem.getProductId(),
                        p.getTitle(),
                        p.getPrice(),
                        p.getThumbnail(),
                        cartItem.getQuantity()
                    );
                }
                return null;
            })
            .filter(item -> item != null)
            .collect(Collectors.toList());
    }
}