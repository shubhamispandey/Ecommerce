package com.example.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CartItemResponse {
    private Long productId;
    private String title;
    private BigDecimal price;
    private String thumbnail;
    private Integer quantity;
}
