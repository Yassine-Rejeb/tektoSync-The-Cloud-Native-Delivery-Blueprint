import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {Catalog} from "../Models/catalog";
const fs = require('fs');

dotenv.config()

//details from the env
const username = process.env.username
const password = process.env.password
const hostname = process.env.COOLSTORE_DB_SERVICE_HOST || 'localhost';
const dbName   = process.env.dbname
const importData = fs.readFileSync(__dirname + '/import.json');
const catalogData = JSON.parse(importData);


//connection string to mongo

const connectionString = `mongodb://${username}:${password}@${hostname}/${dbName}`

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

console.log(connectionString)

//db connection
export const db = mongoose.connect(connectionString, options)
    .then(async res => {
        if(res){
            console.log(`Database connection successful to ${dbName}`);

            // Check if there is already values here
            const currentCatalog = await Catalog.find({});

            // Only insert new rows if empty
            if (currentCatalog.length < 1) {
                await Catalog.insertMany(catalogData);
                console.log('Cart data imported successfully');
            } else {
                console.log(`Using already imported Cart data. Current Rows: ${currentCatalog.length}`);
            }
        }

    }).catch(err => {
        console.log(err)
        return Promise.reject(err);
    });