import {CartItem} from "./cartItem";

export interface CartDTO {
    cartItemTotal: number;
    cartItemPromoSavings: number;
    shippingTotal: number;
    shippingPromoSavings: number;
    cartTotal: number;
    cartItems: CartItem[];
    cartId: string;
}

export class Cart {
    cartItemTotal: number = 0.0;
    cartItemPromoSavings: number = 0.0;
    shippingTotal: number = 0.0;
    shippingPromoSavings: number = 0.0;
    cartTotal: number = 0.0;
    cartId: string;
    cartItems: Map<string, CartItem> = new Map<string, CartItem>();

    constructor(cartId: string) {
        this.cartId = cartId;
    }

    initFromCart(cart: any): Cart {
        this.cartItemTotal = cart.cartItemTotal;
        this.cartItemPromoSavings = cart.cartItemPromoSavings;
        this.shippingTotal = cart.shippingTotal;
        this.shippingPromoSavings = cart.shippingPromoSavings;
        this.cartTotal = cart.cartTotal;
        // COnvert the cartItems to a Map
        this.cartItems = new Map(Object.entries(cart.cartItems));
        return this;
    }

    addCartItem(cartItem: CartItem): void {
        const cartItemInCart = this.cartItems.get(cartItem.itemId);
        if (cartItemInCart instanceof CartItem) {
            cartItemInCart.quantity += cartItem.quantity;
            cartItemInCart.price = cartItem.price;
            cartItemInCart.promoSavings = cartItem.promoSavings;
            this.cartItems.set(cartItemInCart.itemId, cartItemInCart);
        }
        else {
            this.cartItems.set(cartItem.itemId, cartItem);
        }
    }

    removeCartItem(itemId: string): void {
        this.cartItems.delete(itemId);
        this.resetTotals();

    }

    resetTotals(){
        this.cartItemTotal = 0.0;
        this.cartItemPromoSavings = 0.0;
        this.shippingTotal = 0.0;
        this.shippingPromoSavings = 0.0;
        this.cartTotal = 0.0;
    }

    removeAllItems(): void {
        this.cartItems = new Map<string, CartItem>();
    }

    toDTO(): CartDTO {
        const cartItems: CartItem[] = Array.from(this.cartItems.values());
        return {
            cartItemTotal: this.cartItemTotal,
            cartItemPromoSavings: this.cartItemPromoSavings,
            shippingTotal: this.shippingTotal,
            shippingPromoSavings: this.shippingPromoSavings,
            cartTotal: this.cartTotal,
            cartItems,
            cartId: this.cartId,
        };
    }

}
