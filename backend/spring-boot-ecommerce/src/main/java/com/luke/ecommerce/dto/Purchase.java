package com.luke.ecommerce.dto;

import com.luke.ecommerce.entity.Address;
import com.luke.ecommerce.entity.Customer;
import com.luke.ecommerce.entity.Order;
import com.luke.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
