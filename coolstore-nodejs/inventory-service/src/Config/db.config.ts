import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {Inventory} from '../Models/inventory';
import * as fs from 'node:fs';

//load details from the .env file
dotenv.config();

// These values are populated from the .env file
const username = process.env.username;
const password = process.env.password;
const hostname = process.env.COOLSTORE_DB_SERVICE_HOST || 'localhost';
const dbName   = process.env.dbname;

//This is json,  should just be able to require/import it?
const importData:any = fs.readFileSync(__dirname + '/import.json');
const inventoryData = JSON.parse(importData);

//connection string to mongo local
const connectionString = `mongodb://${username}:${password}@${hostname}/${dbName}`;

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

console.log(connectionString);
//db connection
export const db = mongoose.connect(connectionString, options)
    .then(async res => {
        if(res){
            console.log(`Database connection successful to ${dbName}`);

            // Check if there is already values here
            const currentInventory = await Inventory.find({});

            // Only insert new rows if empty
            if (currentInventory.length < 1) {
                await Inventory.insertMany(inventoryData);
                console.log('Cart data imported successfully');
            } else {
                console.log(`Using already imported Cart data. Current Rows: ${currentInventory.length}`);
            }
        }

    }).catch(err => {
        console.log(err)
        return Promise.reject(err);
    })

