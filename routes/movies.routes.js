import express from 'express'


const router = express.Router()
import { client } from "../index.js";

router.post("/insertproducts", express.json(), async function (request, response) {
    const data = request.body
    const insertProducts = await client.db("supermarket").collection("products").insertMany(data)
    response.send(insertProducts);
});

router.put("/updateproducts/:id", express.json(), async function (request, response) {
    const data = request.body
    const { id } = request.params
    const updateProducts = await client.db("supermarket").collection("products").updateOne({ _id: ObjectId(id) }, { $set: data })
    response.send({ message: "succesfully updated" });
});

router.delete("/deleteproduct/:id", async function (request, response) {
    const { id } = request.params
    const deleteProduct = await client.db("supermarket").collection("products").deleteOne({ _id: ObjectId(id) })
    response.send({ message: "successfully deleted" });
})

export default router