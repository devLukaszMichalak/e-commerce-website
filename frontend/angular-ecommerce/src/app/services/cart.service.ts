import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    let alredyExistsInCart: boolean = false;
    let existingCartItem: CartItem = null;

    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);

      alredyExistsInCart = (existingCartItem != undefined);
    }

    if (alredyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotal();

  }


  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish new values to subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log data
    console.log("Added to cart, total is:")
    console.log(`totalPrice${totalPriceValue.toFixed(2)} totalQuantity=${totalQuantityValue}`)

  }
}
