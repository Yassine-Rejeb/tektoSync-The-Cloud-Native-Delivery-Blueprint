import {Inventory} from "../Models/inventory";

export class InventoryService {

    // create one
    async createItem(data: any){
        try {
            const newItem = await Inventory.create(data)
            return newItem

        } catch (error) {
            console.log(error)
        }
    }

    // get all
    async getItems() {
        try {
            const items = await Inventory.find({}, {_id: false, __v: false})
            return items

        } catch (error) {
            console.log(error)
        }
    }

    //get one
    async getItem(itemId: string) {

        try {
            const item = await Inventory.findOne(({ itemId: itemId }), {_id: false, __v: false})
            if (!item) {
                return 'item not found'
            }
            return item

        } catch (error) {
            console.log(error)
        }
    }

    //update inventory
    async updateItem(itemId: string, data: any) {
        try {
            const item = await Inventory.findOneAndUpdate({ itemId: itemId }, data, {new: true})
            if(!item){
                return "item not found"
            }
            return item
        } catch (error) {
            console.log(error)
        }
    }

    //delete inventory
    async deleteItem(itemId: string) {
        try {
            const item = await Inventory.findOneAndDelete({ itemId: itemId })
            if (!item) {
                return 'item not found'
            }
        } catch (error) {
            console.log(error)
        }
    }

}

export const inventoryService = new InventoryService()
