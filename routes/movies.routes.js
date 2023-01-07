import express from 'express'
const router = express.Router()
import { client } from "../index.js";
router.get("/", async function (request, response) {
    const products = await client.db("supermarket").collection("products").find({}).toArray()
    response.send(products);
});

router.post("/supermarket/insertproducts", express.json(), async function (request, response) {
    const data = request.body
    const insertProducts = await client.db("supermarket").collection("products").insertMany(data)
    response.send(insertProducts);
});

router.put("/supermarket/updateproducts/:id", express.json(), async function (request, response) {
    const data = request.body
    const { id } = request.params
    const updateProducts = await client.db("supermarket").collection("products").updateOne({ _id: ObjectId(id) }, { $set: data })
    response.send({ message: "succesfully updated" });
});

router.delete("/supermarket/deleteproduct/:id", async function (request, response) {
    const { id } = request.params
    const deleteProduct = await client.db("supermarket").collection("products").deleteOne({ _id: ObjectId(id) })
    response.send({ message: "successfully deleted" });
})

export default router