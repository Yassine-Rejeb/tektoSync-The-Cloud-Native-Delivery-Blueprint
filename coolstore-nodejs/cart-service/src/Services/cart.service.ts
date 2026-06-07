import {Cart, CartDTO} from "../Models/cart";
import {CartItem} from "../Models/cartItem";
import {CartRequest} from "../Models/cartRequest";
import {ps} from "./promotion.service";
import {ss} from "./shipping.service";
import {getClient} from '../Config/cache.config';
import {getKafkaClient, TOPIC} from '../Config/kafka.config';

export class CartService {

    carts: Map<string, Cart> = new Map();

    async getShoppingCarts() {
        console.log('Getting all the shopping carts');
        this.carts.forEach((value, key) => {
            console.log(`${key} = ${value}`);
          });
        return this.carts.size;
    }

    async getShoppingCart(cartId: string){
        const redis = await getClient();
        let redisCart: any = await redis.get(cartId);
        let cart;

        // No Cart in the cache
        if (!redisCart) {
            console.log('No Cart in Redis....Creating one');
            //Create a new Cart object and return that
            cart = new Cart(cartId);
            await redis.set(cartId, JSON.stringify(cart));
        } else {
            // Cart in the Cache
            console.log('Yes, Cart in Redis');
            cart = new Cart(cartId);
            cart.initFromCart(JSON.parse(redisCart));
        }

        this.priceShoppingCart(cart);
        return cart;
    }


    async removeCart(cartId: string, itemId: string){
        const cart = await this.getShoppingCart(cartId);
        // remove the item from the map
        cart.removeCartItem(itemId);

        // save it back to the cache
        const toSave = JSON.stringify(cart, (key, value) => {
            if (value instanceof Map) {
              return Object.fromEntries(value);
            }
            return value;
          });
        // Save into the cache
        const redis = await getClient();
        await redis.set(cartId, toSave);
        this.priceShoppingCart(cart);
        return cart;
    }

    // "product":{"itemId":"165613","name":"Knit socks","desc":"","price":4.15},"promoSavings":0.0}
    async addItem(cartId: string, item: CartRequest){
        const cart = await this.getShoppingCart(cartId);
        let cartItem = new CartItem(item._itemId, item._name, item._price, item._quantity, 0.0)
        cart.addCartItem(cartItem);

        const toSave = JSON.stringify(cart, (key, value) => {
            if (value instanceof Map) {
              return Object.fromEntries(value);
            }
            return value;
          });
        // Save into the cache
        const redis = await getClient();
        await redis.set(cartId, toSave);

        this.priceShoppingCart(cart);
        return cart;
    }


    async checkout(cartId: string, order: any) {
        const cart = await this.getShoppingCart(cartId);

        // Send the Order to Kafka
        const kfkProducer = getKafkaClient().producer();
        await kfkProducer.connect();

        const msg = {
          key: order.orderId,
          value: JSON.stringify(order, (key, value) => {
            if (value instanceof Map) {
              return Object.fromEntries(value);
            }
            return value;
          })
        }
        try {
          await kfkProducer.send({
            topic: TOPIC,
            messages: [msg]
          });
        } catch(err) {
          console.log('kakfa send Message Error', err);
        }

        cart.removeAllItems();
        cart.resetTotals();
        console.log('Cart after removeAllItems', cart);
        this.priceShoppingCart(cart);
        // Resave the cart
        // this.carts.set(cartId, cart);
         // Save into the cache
        const redis = await getClient();
        const toSave = JSON.stringify(cart, (key, value) => {
          if (value instanceof Map) {
            return Object.fromEntries(value);
          }
          return value;
        });
        await redis.set(cartId, toSave);
        return cart;
    }


    priceShoppingCart(sc: Cart): void {
        ps.applyCartPromotions(sc);
        ss.calculateShipping(sc);

        sc.cartItems.forEach(ci =>{
          sc.cartItemTotal += ((ci.price * ci.quantity) - ci.promoSavings);
          sc.cartItemPromoSavings += ci.promoSavings;
        })

        sc.cartTotal = sc.cartItemTotal - sc.cartItemPromoSavings +(sc.shippingTotal - sc.shippingPromoSavings);

        ss.applyShippingPromotions(sc);

    }
}

export const cartService = new CartService()
