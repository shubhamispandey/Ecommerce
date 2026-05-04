package com.example.ecommerce.kafka;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.OrderItemRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class Consumer {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    @KafkaListener(topics = "order-topic", groupId = "order-group")
    public void consume(String message) {

        Long orderId = Long.valueOf(message);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            // 💳 Simulate payment delay
            Thread.sleep(2000);

            boolean paymentSuccess = new Random().nextBoolean();

            if (paymentSuccess) {
                order.setStatus("SUCCESS");
            } else {
                order.setStatus("FAILED");
            }

            orderRepository.save(order);

        } catch (Exception e) {
            throw new RuntimeException("Kafka processing failed", e);
        }
    }
}