package com.ecommerce.Order.Service.controller;

import com.ecommerce.Order.Service.dto.OrderRequest;
import com.ecommerce.Order.Service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(orderRequest);
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public com.ecommerce.Order.Service.dto.InventoryResponse summary() {
        // Temporary reuse of InventoryResponse fields is not ideal; better to create a dedicated DTO.
        // We'll return a dummy object with 'skuCode' as label and 'inStock' indicating presence.
        // In a real app, create a SummaryResponse DTO.
        long total = orderService.countAll();
        com.ecommerce.Order.Service.dto.InventoryResponse resp = new com.ecommerce.Order.Service.dto.InventoryResponse();
        resp.setSkuCode("totalOrders");
        resp.setInStock(total > 0);
        return resp;
    }
}
