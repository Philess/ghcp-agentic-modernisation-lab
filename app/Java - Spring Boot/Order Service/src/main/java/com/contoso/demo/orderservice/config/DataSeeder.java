package com.contoso.demo.orderservice.config;

import com.contoso.demo.orderservice.model.Order;
import com.contoso.demo.orderservice.model.OrderStatus;
import com.contoso.demo.orderservice.repository.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seed(OrderRepository repository) {
        return args -> {
            repository.save(new Order("alice", new BigDecimal("120.50")));

            Order processingOrder = new Order("alice", new BigDecimal("80.00"));
            processingOrder.setStatus(OrderStatus.PROCESSING);
            repository.save(processingOrder);

            Order completedOrder = new Order("bob", new BigDecimal("42.99"));
            completedOrder.setStatus(OrderStatus.COMPLETED);
            repository.save(completedOrder);
        };
    }
}
