import express from "express";
import {cartController} from "../Controllers/cart.controller";

//initiating the router
export const router = express.Router()

router.get('/',cartController.getCarts)

router.get('/:cartId',cartController.getCart)

router.put('/:cartId',cartController.addItem)

router.delete('/:cartId/:itemId',cartController.removeItem)

router.post('/checkout/:cartId',cartController.checkout)
