import express from 'express'
import cors from 'cors';
import { db} from '../Config/db.config'
import { router } from '../Routes/catalog.routes'

const app = express()

app.use(cors());

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//routes
app.use('/api/v1/products', router)

//db connection then server connection
db.then(() => {
    app.listen(7072, () => console.log('Server is listening on port 7072'))
})

export { app };
