export class CartItem {
    price: number;
    quantity: number;
    itemId: string;
    name: string;
    promoSavings: number;

    constructor(itemId: string, name: string, price: number, quantity: number, promoSavings: number) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.promoSavings = promoSavings;
        this.itemId = itemId;
    }

}
