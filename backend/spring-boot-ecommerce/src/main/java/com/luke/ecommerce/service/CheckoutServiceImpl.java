package com.luke.ecommerce.service;

import com.luke.ecommerce.dao.CustomerRepository;
import com.luke.ecommerce.dto.Purchase;
import com.luke.ecommerce.dto.PurchaseResponse;
import com.luke.ecommerce.entity.Customer;
import com.luke.ecommerce.entity.Order;
import com.luke.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackngNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = purchase.getCustomer();
        customer.add(order);

        customerRepository.save(customer);

        return  new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackngNumber() {
        return UUID.randomUUID().toString();
    }
}
