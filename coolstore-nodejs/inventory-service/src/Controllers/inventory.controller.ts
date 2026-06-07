import {inventoryService} from "../Services/inventory.service";
import  {Request, Response} from "express";
import {InventorySchemaValidate} from "../Models/inventory";

class InventoryController{

    // create new item
    addItem = async (req: Request, res: Response) => {
        //data to be saved in database
        const data = {
            itemId: req.body.itemId.toString(),
            location: req.body.location,
            quantity: req.body.quantity,
            link: req.body.link
        }
        //validating the request
        const {error, value} = InventorySchemaValidate.validate(data)

        if(error){
            res.send(error.message)

        }else{
            //call the create item function in the service and pass the data from the request
            const post = await inventoryService.createItem(value)
            res.status(201).send(post)
        }

    }


    // get all
    getItems = async (req: Request, res: Response) => {
        const items = await inventoryService.getItems()
        res.send(items)
    }


    // get one
    getItem = async (req: Request, res: Response) => {
        //get id from the parameter
        const id = req.params.id
        const item = await inventoryService.getItem(id)
        res.send(item)
    }

    //update item
    updateItem = async (req: Request, res: Response) => {
        const id = req.params.id
        const item = await inventoryService.updateItem(id, req.body)
        res.send(item)
    }

    //delete item
    deleteItem = async (req: Request, res: Response) => {
        const id = req.params.id

        try {
            await inventoryService.deleteItem(id)

            const message = {
                status: 'success',
                message: 'inventory item deleted',
                itemId: id,
            };

            res.status(200).json(message)
        } catch (error) {
            // Handle the error
            console.error('Error deleting inventory:', error);
            const errorMessage = {
                status: 'error',
                message: 'Failed to delete inventory',
            };
            res.status(500).json(errorMessage);
        }
    }
}

/*  NOTE: If IInventory was extending a Document a mapper would be required for loc->Location and back.
const mapFields = (data: any): any => {
    const mappedData = {
        ...data,
        loc: data.location, // Map 'location' to 'loc'
    };
    delete mappedData.location;
    return mappedData;
};

const validateAndMapFields = (data: any) => {
    const { error, value } = InventorySchemaValidate.validate(data);
    if (error) {
        // Handle validation error
        throw error;
    }
    return mapFields(value);
};
*/

export const inventoryController = new InventoryController()
