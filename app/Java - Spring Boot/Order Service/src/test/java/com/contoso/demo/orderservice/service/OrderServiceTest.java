package com.contoso.demo.orderservice.service;

import com.contoso.demo.orderservice.model.Order;
import com.contoso.demo.orderservice.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void totalForCustomerSumsAmounts() {
        orderRepository.save(new Order("charlie", new BigDecimal("10.00")));
        orderRepository.save(new Order("charlie", new BigDecimal("15.50")));

        BigDecimal total = orderService.totalForCustomer("charlie");

        assertEquals(new BigDecimal("25.50"), total);
    }
}
