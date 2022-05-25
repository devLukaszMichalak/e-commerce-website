package com.luke.ecommerce.service;

import com.luke.ecommerce.dto.Purchase;
import com.luke.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
