//importing modules
import {model, Schema,} from 'mongoose'
import Joi from 'joi'

//validation schema
export const InventorySchemaValidate = Joi.object({
    itemId: Joi.string().required(),
    location: Joi.string(),
    quantity: Joi.number(),
    link: Joi.string(),

})

interface IInventory{
    itemId: string;
    location: string; // Field name as 'loc'
    quantity: number;
    link: string;
}

const inventorySchema: Schema = new Schema({
    itemId: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    link: {
        type: String,
    },
});


/* NOTE: If IInventory was extending a Document a mapper would be required for loc->Location and back.
inventorySchema.set('toJSON', {

    transform: function (doc, ret, options) {
        ret.location = ret.loc; // Map 'loc' to 'location' in JSON response
        delete ret.loc;
        delete ret._id;
        delete ret.__v;
    },
});
 */

export const Inventory = model<IInventory>('Inventory', inventorySchema)

