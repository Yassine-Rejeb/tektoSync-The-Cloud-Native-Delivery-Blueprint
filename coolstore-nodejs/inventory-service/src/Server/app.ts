import dotenv from 'dotenv';
import express from 'express'
import { db } from '../Config/db.config'
import { router } from '../Routes/inventory.routes'
import path from 'node:path';

//load details from the .env file
dotenv.config();

const app = express()
app.use(express.static(path.join(__dirname, '../public')));
//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))



//routes
app.use('/api/v1/inventory', router)

const PORT = process.env.port || 7070;
//db connection then server connection
// TODO: can we change this?  do we need to?
db.then(() => {
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
})

export { app };
