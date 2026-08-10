package com.contoso.demo.orderservice.service;

import com.contoso.demo.orderservice.model.Order;
import com.contoso.demo.orderservice.model.OrderStatus;
import com.contoso.demo.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> findByCustomer(String customer) {
        return orderRepository.findByCustomer(customer);
    }

    public Order create(Order order) {
        order.setStatus(OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    public Optional<Order> updateStatus(Long id, OrderStatus status) {
        Optional<Order> existingOrder = orderRepository.findById(id);
        if (!existingOrder.isPresent()) {
            return Optional.empty();
        }

        Order order = existingOrder.get();
        order.setStatus(status);
        return Optional.of(orderRepository.save(order));
    }

    // Java 8 stream usage - kept simple on purpose for the demo
    public BigDecimal totalForCustomer(String customer) {
        return orderRepository.findByCustomer(customer)
                .stream()
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
