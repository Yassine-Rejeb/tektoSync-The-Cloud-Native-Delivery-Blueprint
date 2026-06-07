import {catalogService} from "../Services/catalog.service";
import  {Request, Response} from "express";
import {CatalogSchemaValidate} from "../Models/catalog";

class CatalogController {

//{
// "itemId":"329299",
// "title":"Quarkus T-shirt",
// "desc":"Mens Clothing",
// "price":10.00,
// "quantity":736,
// "image":"329299.jpg",
// "category":"Mens Clothing"
// }

    // get all
    getItems = async (req: Request, res: Response) => {
        const items = await catalogService.getItems()
        res.send(items)
    }


    // get one
    getItem = async (req: Request, res: Response) => {
        //get id from the parameter
        const id = req.params.id
        const item = await catalogService.getItem(id)
        res.send(item)
    }

}
export const catalogController = new CatalogController()
