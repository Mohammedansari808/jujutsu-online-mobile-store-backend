
import express from 'express'
import { auth } from "../middleware/auth.js"
const router = express.Router()
import { otauth } from '../middleware/otauth.js';
import { ObjectId } from 'mongodb';
import { datasCheck, addingOrders, dataForMyOrders, getAllOrders, updatingDeliveryStatus } from '../services/orders.service.js';





//adding order to my order after payment success
router.post("/orders/:id", otauth, async function (request, response) {
    const { id } = request.params
    const data = request.body
    const datas = await datasCheck(id)
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

        const datas = await addingOrders(id, finaldata)
        if (datas) {
            response.send({ message: "updated" })
        } else {
            response.send({ message: "error" })
        }
    }

})


//to show in my orders page
router.get("/orderdata/:id", auth, async function (req, res) {
    const { id } = req.params
    const data = await dataForMyOrders(id)

    if (data) {
        res.send({ "data": data.OrderData })
    }
})


//to show in pending orders
router.get("/allorders", auth, async function (req, res) {
    const data = await getAllOrders()
    res.send({ "data": data })

})


//to change delivery status in orders
router.post("/changestatus", auth, async function (req, res) {
    const data = req.body

    const datas = await updatingDeliveryStatus(data)
    if (datas) {
        res.send({ message: "success" })
    } else {
        res.send({ message: "error" })
    }

})

export default router


