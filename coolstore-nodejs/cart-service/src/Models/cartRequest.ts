export class CartRequest {
        constructor(itemId: string, name: string, price: number, quantity: number, product: string) {
                this._itemId = itemId;
                this._name = name;
                this._price = price;
                this._quantity = quantity;
                this._product = product;
        }

        _itemId: string;
        _name: string;
        _price: number;
        _quantity: number;
        _product: string;

}
