import express from "express";
import {catalogController} from "../Controllers/catalog.controller";

//initiating the router
export const router = express.Router()

//get products
router.get('/', catalogController.getItems)

//get single product
router.get('/:id', catalogController.getItem)

