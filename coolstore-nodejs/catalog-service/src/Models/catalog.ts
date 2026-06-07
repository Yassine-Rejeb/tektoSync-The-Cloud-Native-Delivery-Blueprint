//importing modules
import {model, Schema,} from 'mongoose'
import Joi from 'joi'

//validation schema
export const CatalogSchemaValidate = Joi.object({
    itemId: Joi.string().required(),
    title: Joi.string().required(),
    desc: Joi.string(),
    price: Joi.number(),
    quantity: Joi.number(),
    image: Joi.string(),
    category: Joi.string(),

})

interface ICatalog{
    itemId: string;
    title: string;
    desc: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}

const catalogSchema: Schema = new Schema({
    itemId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
    },
    desc: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
    },
});


export const Catalog = model<ICatalog>('Catalog', catalogSchema)

