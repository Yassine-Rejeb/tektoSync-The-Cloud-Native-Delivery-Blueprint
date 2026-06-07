import {Cart} from "../Models/cart";
import {CartItem} from "../Models/cartItem";

export class PromotionService {
    promotions: Map<string, number> = new Map();

    constructor() {
        this.promotions.set("329299", 0.25);
    }


    getPromotions(itemId: string){
        if(this.promotions.has(itemId)){
            return this.promotions.get(itemId);
        }
        else
            return 0.0;
    }


    applyCartPromotions(cart: Cart){
        cart.cartItems.forEach(ci =>{
            this.applyCartItemPromotions(ci);
        })
    }

    applyCartItemPromotions(cartItem: CartItem) {
        if(this.promotions.has(cartItem.itemId)){
            // @ts-ignore
            cartItem.promoSavings = this.promotions.get(cartItem.itemId) *cartItem.quantity * cartItem.price;
       }
    }

    getAllPromotions(): Map<string, number> {
        return this.promotions;
    }
}

export const ps = new PromotionService()
