import express from "express";
import {inventoryController} from "../Controllers/inventory.controller";

//initiating the router
export const router = express.Router()

router.post('/',inventoryController.addItem)
router.get('/', inventoryController.getItems)
router.get('/:id', inventoryController.getItem)
router.put('/:id', inventoryController.updateItem)
router.delete('/:id', inventoryController.deleteItem)
