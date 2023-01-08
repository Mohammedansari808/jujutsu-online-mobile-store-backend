import express from 'express'
import * as dotenv from 'dotenv'
import productsRouter from "./routes/movies.routes.js"
dotenv.config()
const app = express();
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';
import cors from "cors"

const PORT = process.env.PORT;

const Mongo_URL = process.env.Mongo_URL;
const client = new MongoClient(Mongo_URL)
await client.connect()
console.log("Mongo is connected")
app.use(cors())

app.use("/products", productsRouter)

app.get("/", async function (request, response) {
    const products = await client.db("supermarket").collection("products").find({}).toArray()
    response.send(products);

});


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
export { client }











