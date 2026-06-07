import {Cart} from "../Models/cart";
import {PromotionService} from "./promotion.service";

export class ShippingService {
  calculateShipping(sc: Cart): void {
    if (sc !== null) {
      if (sc.cartItemTotal >= 0 && sc.cartItemTotal < 25) {
        sc.shippingTotal=2.99;
      } else if (sc.cartItemTotal >= 25 && sc.cartItemTotal < 50) {
        sc.shippingTotal=4.99;
      } else if (sc.cartItemTotal >= 50 && sc.cartItemTotal < 75) {
        sc.shippingTotal=6.99;
      } else if (sc.cartItemTotal >= 75 && sc.cartItemTotal < 100) {
        sc.shippingTotal=8.99;
      } else if (sc.cartItemTotal >= 100 && sc.cartItemTotal < 10000) {
        sc.shippingTotal=10.99;
      }
    }
  }

  applyShippingPromotions(cart: Cart) {
    // PROMO: if cart total is greater than 75, free shipping
    if (cart.cartTotal >= 75) {
      cart.shippingPromoSavings = cart.shippingTotal;
      cart.shippingTotal = 0;
    }
  }

}

export const ss = new ShippingService()
