import {Catalog} from "../Models/catalog";
import {InventoryService} from "./inventory.service";


export class CatalogService {


    // get all
    async getItems() {
        try {
            const items = await Catalog.find({}, {_id: false, __v: false})
            return await Promise.all(
                items.map(async (item) => {
                    const inventoryItem = await InventoryService.getInventoryItem(item.itemId);
                    return {
                        ...item.toObject(),
                        quantity: inventoryItem.quantity,
                    };
                })
            );
        } catch (error) {
            console.log(error)
        }
    }

    //get one
    async getItem(itemId: string){

        console.log("calling getItem with "+itemId)
        try {
            const item = await Catalog.findOne(({ itemId: itemId }), {_id: false, __v: false} )
            if (!item) {
                return 'item not found'
            }

            // Get quantity from inventory-service
            const inventoryItem = await InventoryService.getInventoryItem(item.itemId);

            return {
                ...item.toObject(),
                quantity: inventoryItem.quantity,
            };

        } catch (error) {
            console.log(error)
        }
    }

}





export const catalogService = new CatalogService()
