
import express from 'express'
import { auth } from "../middleware/auth.js"
const router = express.Router()
import { client } from "../index.js";
import { otauth } from '../middleware/otauth.js';
import { ObjectId } from 'mongodb';






router.post("/orders/:id", otauth, async function (request, response) {
    const { id } = request.params
    const data = request.body
    const datas = await client.db("jujutsustore").collection("login").findOne({ username: id })
    let num = datas.OrderData.length + 1

    const finaldata = {
        order_no: num,
        product: data.product,
        address: data.address,
        ordered: true,
        paid: true,
        delivered: false,
    }
    if (data == undefined) {
        console.log("error in fetching product")
    } else {

        const datas = await client.db("jujutsustore").collection("login").updateOne({ username: id }, { $push: { OrderData: finaldata } })
        if (datas) {
            response.send({ message: "updated" })
        } else {
            response.send({ message: "error" })
        }
    }

})

router.get("/orderdata/:id", auth, async function (req, res) {
    const { id } = req.params
    const data = await client.db("jujutsustore").collection("login").findOne({ username: id }, { OrderData: 1 })

    if (data) {
        res.send({ "data": data.OrderData })
    }
})

router.get("/allorders", auth, async function (req, res) {
    const data = await client.db("jujutsustore").collection("login").find({}).project({ OrderData: 1, username: 1, email: 1 }).toArray()
    res.send({ "data": data })

})

router.post("/changestatus", auth, async function (req, res) {
    const data = req.body

    const datas = await client.db("jujutsustore").collection("login").updateOne({ email: data.email, "OrderData.order_no": data.order }, {
        $set: { "OrderData.$.delivered": !data.delivered }
    })
    if (datas) {
        res.send({ message: "success" })
    } else {
        res.send({ message: "error" })
    }

})

export default router