import express from 'express'
import { ObjectId } from 'mongodb';


const router = express.Router()
import { client } from "../index.js";
import { auth } from '../middleware/auth.js';


router.get("/", express.json(), auth, async function (request, response) {
    const products = await client.db("jujutsustore").collection("products").find({}).toArray()
    response.send(products);
});



router.get("/:id", auth, async function (request, response) {
    const { id } = request.params
    const products = await client.db("jujutsustore").collection("products").findOne({ _id: ObjectId(id) })
    response.send(products);
});
router.post("/addproducts", auth, express.json(), async function (request, response) {
    const data = request.body
    const insertProducts = await client.db("jujutsustore").collection("products").insertOne(data)


    response.send(insertProducts);
});

router.put("/updateproducts/:id", express.json(), auth, async function (request, response) {
    const data = request.body
    const { id } = request.params
    const updateProducts = await client.db("jujutsustore").collection("products").updateOne({ _id: ObjectId(id) }, { $set: data })
    if (updateProducts) {
        response.send({ message: "update success" });

    } else {
        response.send({ message: "error" })
    }
});

router.delete("/deleteproduct/:id", auth, async function (request, response) {
    const { id } = request.params
    const deleteProduct = await client.db("jujutsustore").collection("products").deleteOne({ _id: ObjectId(id) })
    if (deleteProduct) {
        response.send({ message: "successfully deleted" });
    } else {
        response.send({ message: "error" })
    }
})

export default router