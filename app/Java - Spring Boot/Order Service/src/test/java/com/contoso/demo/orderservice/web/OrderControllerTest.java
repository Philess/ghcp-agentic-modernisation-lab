package com.contoso.demo.orderservice.web;

import com.contoso.demo.orderservice.model.Order;
import com.contoso.demo.orderservice.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Test
    void listReturnsAllOrders() throws Exception {
        when(orderService.findAll()).thenReturn(Arrays.asList(
                new Order("alice", new BigDecimal("120.50")),
                new Order("bob", new BigDecimal("42.99"))
        ));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].customer").value("alice"));
    }

    @Test
    void getByIdReturns404WhenMissing() throws Exception {
        when(orderService.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/orders/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void totalForCustomerReturnsValue() throws Exception {
        when(orderService.totalForCustomer("alice")).thenReturn(new BigDecimal("200.50"));

        mockMvc.perform(get("/api/orders/customer/alice/total"))
                .andExpect(status().isOk())
                .andExpect(content().string("200.50"));
    }

    @Test
    void createReturns201() throws Exception {
        when(orderService.create(any(Order.class)))
                .thenReturn(new Order("dave", new BigDecimal("15.00")));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customer\":\"dave\",\"amount\":15.00}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customer").value("dave"));
    }

    @Test
    void createRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
