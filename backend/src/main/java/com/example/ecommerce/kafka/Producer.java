package com.example.ecommerce.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Producer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "order-topic";

    public void sendOrderEvent(String orderId) {
        kafkaTemplate.send(TOPIC, orderId);
    }
}