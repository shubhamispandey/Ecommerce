package com.example.ecommerce.kafka;



import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class Consumer {

    // @KafkaListener(topics = "order-topic", groupId = "group1")
    public void consume(String message) {
        System.out.println("Processing order: " + message);

        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}