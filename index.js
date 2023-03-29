import express from 'express'
import * as dotenv from 'dotenv'
import productsRouter from "./routes/mobiles.routes.js"
import credentialsRouter from "./routes/credentials.routes.js"
dotenv.config()
const app = express();
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';
import cors from "cors"

const PORT = process.env.PORT;
app.use(express.json())
const Mongo_URL = process.env.Mongo_URL;
const client = new MongoClient(Mongo_URL)
await client.connect()
console.log("Mongo is connected")
app.use(cors())
app.use(express.static("public"));
app.use("/products", productsRouter)
app.use("/", credentialsRouter)


app.get("/", async function (request, response) {
    response.send("conncetion success");

});



app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
export { client }











