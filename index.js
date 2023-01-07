import express from 'express'
import * as dotenv from 'dotenv'
import productsRouter from "./routes/movies.routes.js"
dotenv.config()
const app = express();
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';
import { cors } from "cors"


app.use(cors())
const PORT = process.env.PORT;

const Mongo_URL = process.env.Mongo_URL;
const client = new MongoClient(Mongo_URL)
await client.connect()
console.log("Mongo is connected")

app.use("/products", productsRouter)
app.get("/", async function (request, response) {
    const products = await client.db("supermarket").collection("products").find({}).toArray()
    response.send(products);
});
// app.get("/", async function (request, response) {
//     const products = await client.db("supermarket").collection("products").find({}).toArray()
//     response.send(products);
// });

// app.post("/supermarket/insertproducts", express.json(), async function (request, response) {
//     const data = request.body
//     const insertProducts = await client.db("supermarket").collection("products").insertMany(data)
//     response.send(insertProducts);
// });

// app.put("/supermarket/updateproducts/:id", express.json(), async function (request, response) {
//     const data = request.body
//     const { id } = request.params
//     const updateProducts = await client.db("supermarket").collection("products").updateOne({ _id: ObjectId(id) }, { $set: data })
//     response.send({ message: "succesfully updated" });
// });

// app.delete("/supermarket/deleteproduct/:id", async function (request, response) {
//     const { id } = request.params
//     const deleteProduct = await client.db("supermarket").collection("products").deleteOne({ _id: ObjectId(id) })
//     response.send({ message: "successfully deleted" });
// })

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
export { client }











